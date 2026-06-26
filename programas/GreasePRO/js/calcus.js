document.addEventListener('DOMContentLoaded', function () {
    const heroSection = document.querySelector('.hero-section');
    const pageContent = document.getElementById('page-content-wrapper');

    if (pageContent) {
        pageContent.style.display = 'none';
    }

    function showContent() {
        if (heroSection) {
            heroSection.style.display = 'none';
        }
        if (pageContent) {
            pageContent.style.display = 'block';
        }
    }

    window.mostrarfame1 = function(){
        showContent();
        document.getElementById('frame1').style.display='block';
        document.getElementById('frame2').style.display='none';
        document.getElementById('frame3').style.display='none';
        document.getElementById('frame4').style.display='none';
        document.getElementById('frame5').style.display='none';
        document.getElementById('frame6').style.display='none';
        document.getElementById('frame7').style.display='none';
        document.getElementById('frame8').style.display='none';
        document.getElementById('frame9').style.display='none';
        document.getElementById('frame10').style.display='none';
    }
    window.mostrarfame2 = function(){
        showContent();
        document.getElementById('frame2').style.display='block';
        document.getElementById('frame1').style.display='none';
        document.getElementById('frame3').style.display='none';
        document.getElementById('frame4').style.display='none';
        document.getElementById('frame5').style.display='none';
        document.getElementById('frame6').style.display='none';
        document.getElementById('frame7').style.display='none';
        document.getElementById('frame8').style.display='none';
        document.getElementById('frame9').style.display='none';
        document.getElementById('frame10').style.display='none';
    }
    window.mostrarfame3 = function(){
        showContent();
        document.getElementById('frame3').style.display='block';
        document.getElementById('frame1').style.display='none';
        document.getElementById('frame2').style.display='none';
        document.getElementById('frame4').style.display='none';
        document.getElementById('frame5').style.display='none';
        document.getElementById('frame6').style.display='none';
        document.getElementById('frame7').style.display='none';
        document.getElementById('frame8').style.display='none';
        document.getElementById('frame9').style.display='none';
        document.getElementById('frame10').style.display='none';
    }
    window.mostrarfame4 = function(){
        showContent();
        document.getElementById('frame4').style.display='block';
        document.getElementById('frame1').style.display='none';
        document.getElementById('frame2').style.display='none';
        document.getElementById('frame3').style.display='none';
        document.getElementById('frame5').style.display='none';
        document.getElementById('frame6').style.display='none';
        document.getElementById('frame7').style.display='none';
        document.getElementById('frame8').style.display='none';
        document.getElementById('frame9').style.display='none';
        document.getElementById('frame10').style.display='none';
    }
    window.mostrarfame5 = function(){
        showContent();
        document.getElementById('frame5').style.display='block';
        document.getElementById('frame1').style.display='none';
        document.getElementById('frame2').style.display='none';
        document.getElementById('frame3').style.display='none';
        document.getElementById('frame4').style.display='none';
        document.getElementById('frame6').style.display='none';
        document.getElementById('frame7').style.display='none';
        document.getElementById('frame8').style.display='none';
        document.getElementById('frame9').style.display='none';
        document.getElementById('frame10').style.display='none';
    }
    window.mostrarfame6 = function(){
        showContent();
        document.getElementById('frame6').style.display='block';
        document.getElementById('frame1').style.display='none';
        document.getElementById('frame2').style.display='none';
        document.getElementById('frame3').style.display='none';
        document.getElementById('frame4').style.display='none';
        document.getElementById('frame5').style.display='none';
        document.getElementById('frame7').style.display='none';
        document.getElementById('frame8').style.display='none';
        document.getElementById('frame9').style.display='none';
        document.getElementById('frame10').style.display='none';
    }
    window.mostrarfame7 = function(){
        showContent();
        document.getElementById('frame7').style.display='block';
        document.getElementById('frame1').style.display='none';
        document.getElementById('frame2').style.display='none';
        document.getElementById('frame3').style.display='none';
        document.getElementById('frame4').style.display='none';
        document.getElementById('frame5').style.display='none';
        document.getElementById('frame6').style.display='none';
        document.getElementById('frame8').style.display='none';
        document.getElementById('frame9').style.display='none';
        document.getElementById('frame10').style.display='none';
    }
    window.mostrarfame8 = function(){
        showContent();
        document.getElementById('frame8').style.display='block';
        document.getElementById('frame1').style.display='none';
        document.getElementById('frame2').style.display='none';
        document.getElementById('frame3').style.display='none';
        document.getElementById('frame4').style.display='none';
        document.getElementById('frame5').style.display='none';
        document.getElementById('frame6').style.display='none';
        document.getElementById('frame7').style.display='none';
        document.getElementById('frame9').style.display='none';
        document.getElementById('frame10').style.display='none';
    }
    window.mostrarfame9 = function(){
        showContent();
        document.getElementById('frame9').style.display='block';
        document.getElementById('frame1').style.display='none';
        document.getElementById('frame2').style.display='none';
        document.getElementById('frame3').style.display='none';
        document.getElementById('frame4').style.display='none';
        document.getElementById('frame5').style.display='none';
        document.getElementById('frame6').style.display='none';
        document.getElementById('frame7').style.display='none';
        document.getElementById('frame8').style.display='none';
        document.getElementById('frame10').style.display='none';
    }
    window.mostrarfame10 = function(){
        showContent();
        document.getElementById('frame10').style.display='block';
        document.getElementById('frame1').style.display='none';
        document.getElementById('frame2').style.display='none';
        document.getElementById('frame3').style.display='none';
        document.getElementById('frame4').style.display='none';
        document.getElementById('frame5').style.display='none';
        document.getElementById('frame6').style.display='none';
        document.getElementById('frame8').style.display='none';
        document.getElementById('frame7').style.display='none';
        document.getElementById('frame9').style.display='none';
    }
});