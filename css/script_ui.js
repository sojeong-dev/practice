
$(function() {
  'use strict';

  var $header = $('header'),
      mobile = 1280;

  init();
  settingGNBFn();
  showIndicatorContFn();
  scrollFn();

  $(window).on('scroll resize', function() {
    scrollFn();
  });

  //헤더 언어 변경 클릭 이벤트
  $header.find('.lang_list > li > a').on('click', function() {
    $header.find('.lang_list > li').removeClass('on'); //초기화
    $(this).parent().addClass('on');  //li.on
  });

  //메인 비주얼 높이 설정
  $('.main_visual').css({'height': $(window).outerHeight()});

  //푸터 family site 버튼 클릭 이벤트
  $('#footer .family > .btn_link_toggle').on('click', function() {
    $(this).toggleClass('on');
  });

  //스크롤 셋팅 함수
  function scrollFn() {
    //헤더 스크롤 이벤트
    checkScrollTopFn($header);

    //페이지 인디케이터 스크롤 이벤트
    checkScrollAmtFn($('section'));
  }

  //#header: 요소가 변경될 스크롤 위치 찾는 함수
  function checkScrollTopFn($selector) {  //$header
    var trigger = 0;
    if($('body').hasClass('main')) trigger = $('.main_visual').outerHeight() - $header.outerHeight();
  
    // if ($('.navi_area').hasClass('open')) return false; //네비가 열린 상태에서는 미동작
    if($(document).scrollTop() > trigger) {
      $header.addClass('down');
    } else {
      $header.removeClass('down');
    }
  }

  //section: 페이지 인디케이터 요소가 들어설 스크롤 범위(amount) 찾는 함수
  function checkScrollAmtFn($selector) {  //section
    var $indicatorMenu = $('#pageNav > ul.indicator > li'),
        scrollAmt = $(document).scrollTop();

    $indicatorMenu.removeClass('on'); //초기화

    $selector.each(function(i) {
      $selector = $(this);
      var triggerHook = $(window).outerHeight() / 2,
          triggerStart = $selector.offset().top - triggerHook,
          triggerEnd = $selector.offset().top + $selector.outerHeight(true) - triggerHook;
      // console.log(scrollAmt + '/' + triggerStart + '/' + triggerEnd);

      if(triggerStart <= scrollAmt && scrollAmt < triggerEnd && $(window).outerWidth() > 1024) {
        $indicatorMenu.eq(i).addClass('on');

        if($selector.attr('id') === 'news') {
          $('#pageNav').addClass('bottom');
        } else {
          $('#pageNav').removeClass('bottom');
        }
      }
    });
  }

  //ul.indicator: 인디케이터 메뉴 클릭 시, 해당 화면으로 이동시키는 함수
  function showIndicatorContFn() {
    var $indicatorMenu = $('#pageNav > ul.indicator > li > a');

    $indicatorMenu.on('click', function() {
      var contID = $(this).attr('href'),
          contOffsetTop = $(contID).offset().top - $header.outerHeight();

      $indicatorMenu.parent().removeClass('on');  //초기화
      $(this).parent().addClass('on');
      //*animate() 사용할 때, 항상 먼저 stop() 넣어줘야 > 부화가 걸릴 수 있으므로 정확히 stop(true) 넣어줘야
      $('html, body').stop(true).animate({'scrollTop': contOffsetTop + 'px'}, 1000);
    });
  }

  //#gnb 셋팅 함수
  function settingGNBFn() {
    var $gnb = $header.find('#gnb'),
        $menu = $gnb.find('.gnb_depth1 > li > a'),
        $btnToggle = $header.find('.btn_gnb_toggle'),
        $naviArea = $btnToggle.next();

    //pc: 네비 열기
    //*focus, click 등 이벤트는 a링크에 직접주는 것이 좋지만, focusin/focusout: 버블링되므로 li에 이벤트 붙임 > 헤더가 열린상태로 하위 메뉴까지 포커스가 가기위새서
    $menu.parent().on('mouseenter focusin', function() {  //li
      if($(window).outerWidth() <= mobile) return false;  //모바일 미동작
      $header.addClass('open');
    });

    //pc: 네비 닫기
    $header.on('mouseleave focusout', function() {
      if($(window).outerWidth() <= mobile) return false;  //모바일 미동작
      $header.removeClass('open');
    });

    //mobile: 네비 열기
    $btnToggle.on('click', function() {
      $(this).toggleClass('on');
      $naviArea.toggleClass('open');
      $header.toggleClass('open')
      $('html, body').toggleClass('scroll_disable');

      //메뉴 클릭하면, 하위 메뉴 나오게
      $menu.on('click', function(e) {
        if($(window).outerWidth() <= mobile && $(this).parent().find('ul').length > 0) {
          e.preventDefault(); //메뉴 클릭될 때, 상단으로 올라가지 않게 기본동작 막음

          $(this).parent().toggleClass('on'); //li.on > ul {display: block;}
          $(this).parent().siblings().removeClass('on'); 
        }
      });
    });

    //반응형 전환시 처리(초기화)
    $(window).on('resize', function() { 
      if($(window).outerWidth() > mobile) {  
        $btnToggle.removeClass('on');
        $naviArea.removeClass('open');
        $header.removeClass('open');
        $('html, body').removeClass('scroll_disable');
      }
    });
  }

  //기본 셋팅(초기화) 함수
  function init() {
    //a링크 기본동작 막음
    $(document).on('click', 'a[href="#"]', function(e) {
      e.preventDefault();
    });
  }
});

