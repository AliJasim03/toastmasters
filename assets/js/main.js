/**
 * Template Name: TheEvent
 * Template URL: https://bootstrapmade.com/theevent-conference-event-bootstrap-template/
 * Updated: Aug 07 2024 with Bootstrap v5.3.3
 * Author: BootstrapMade.com
 * License: https://bootstrapmade.com/license/
 */

(function () {
    "use strict";

    /**
     * Apply .scrolled class to the body as the page is scrolled down
     */
    function toggleScrolled() {
        const selectBody = document.querySelector('body');
        const selectHeader = document.querySelector('#header');
        if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
        window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
    }

    document.addEventListener('scroll', toggleScrolled);
    window.addEventListener('load', toggleScrolled);

    /**
     * Mobile nav toggle
     */
    const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

    function mobileNavToogle() {
        document.querySelector('body').classList.toggle('mobile-nav-active');
        mobileNavToggleBtn.classList.toggle('bi-list');
        mobileNavToggleBtn.classList.toggle('bi-x');
    }

    mobileNavToggleBtn.addEventListener('click', mobileNavToogle);

    /**
     * Hide mobile nav on same-page/hash links
     */
    document.querySelectorAll('#navmenu a').forEach(navmenu => {
        navmenu.addEventListener('click', () => {
            if (document.querySelector('.mobile-nav-active')) {
                mobileNavToogle();
            }
        });
    });

    /**
     * Toggle mobile nav dropdowns
     */
    document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
        navmenu.addEventListener('click', function (e) {
            e.preventDefault();
            this.parentNode.classList.toggle('active');
            this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
            e.stopImmediatePropagation();
        });
    });

    /**
     * Preloader - USING SINGLE APPROACH
     */
    const preloader = document.querySelector('#preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            console.log("Window loaded, removing preloader"); // Debugging line
            // First add the 'loaded' class to fade it out
            preloader.classList.add('loaded');

            // Then remove it after the transition completes
            setTimeout(() => {
                if (preloader && preloader.parentNode) {
                    preloader.remove();
                    console.log("Preloader removed"); // Debugging line
                }
            }, 600); // Increased from 300 to 600ms for more visible effect
        });
    }
    /**
     * Scroll top button
     */
    let scrollTop = document.querySelector('.scroll-top');

    function toggleScrollTop() {
        if (scrollTop) {
            window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
        }
    }

    if (scrollTop) {
        scrollTop.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    window.addEventListener('load', toggleScrollTop);
    document.addEventListener('scroll', toggleScrollTop);

    /**
     * Animation on scroll function and init
     */
    function aosInit() {
        AOS.init({
            // Reduce animation duration for faster perceived loading
            duration: 400,
            // Increase offset to start animations earlier
            offset: 150,
            // Disable animations on mobile for better performance
            disable: window.innerWidth < 768 ? true : false,
            easing: 'ease-in-out',
            once: true,
            mirror: false
        });
    }

    window.addEventListener('load', aosInit);

    // 2. Preload visible images
    const preloadVisibleImages = () => {
        const images = document.querySelectorAll('img[loading="lazy"]');
        const viewportHeight = window.innerHeight;

        images.forEach(img => {
            const rect = img.getBoundingClientRect();
            // If image is within 200px of viewport, force load
            if (rect.top < viewportHeight + 200) {
                img.loading = 'eager';
                img.setAttribute('fetchpriority', 'high');
            }
        });
    };

    preloadVisibleImages();

    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (scrollTimeout) {
            window.cancelAnimationFrame(scrollTimeout);
        }

        scrollTimeout = window.requestAnimationFrame(function() {
            preloadVisibleImages();
        });
    }, { passive: true });

    /**
     * Initiate glightbox
     */
    const glightbox = GLightbox({
        selector: '.glightbox'
    });

    /**
     * Init swiper sliders
     */
    function initSwiper() {
        document.querySelectorAll(".init-swiper").forEach(function (swiperElement) {
            if (!swiperElement.querySelector(".swiper-config")) {
                console.error("Swiper config not found for element", swiperElement);
                return;
            }

            try {
                let config = JSON.parse(
                    swiperElement.querySelector(".swiper-config").innerHTML.trim()
                );

                if (swiperElement.classList.contains("swiper-tab")) {
                    if (typeof initSwiperWithCustomPagination === 'function') {
                        initSwiperWithCustomPagination(swiperElement, config);
                    } else {
                        console.error("initSwiperWithCustomPagination function not defined");
                        new Swiper(swiperElement, config);
                    }
                } else {
                    new Swiper(swiperElement, config);
                }
            } catch (error) {
                console.error("Error initializing swiper:", error);
            }
        });
    }

    window.addEventListener("load", initSwiper);

    /**
     * Frequently Asked Questions Toggle
     */
    document.querySelectorAll('.faq-item h3, .faq-item .faq-toggle').forEach((faqItem) => {
        faqItem.addEventListener('click', () => {
            faqItem.parentNode.classList.toggle('faq-active');
        });
    });

    /**
     * Correct scrolling position upon page load for URLs containing hash links.
     */
    window.addEventListener('load', function (e) {
        if (window.location.hash) {
            if (document.querySelector(window.location.hash)) {
                setTimeout(() => {
                    let section = document.querySelector(window.location.hash);
                    let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
                    window.scrollTo({
                        top: section.offsetTop - parseInt(scrollMarginTop),
                        behavior: 'smooth'
                    });
                }, 100);
            }
        }
    });

    /**
     * Navmenu Scrollspy
     */
    let navmenulinks = document.querySelectorAll('.navmenu a');

    function navmenuScrollspy() {
        navmenulinks.forEach(navmenulink => {
            if (!navmenulink.hash) return;
            let section = document.querySelector(navmenulink.hash);
            if (!section) return;
            let position = window.scrollY + 200;
            if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
                document.querySelectorAll('.navmenu a.active').forEach(link => link.classList.remove('active'));
                navmenulink.classList.add('active');
            } else {
                navmenulink.classList.remove('active');
            }
        })
    }

    window.addEventListener('load', navmenuScrollspy);
    document.addEventListener('scroll', navmenuScrollspy);

})();

// Add to your main.js file
// PWA Installation logic
let deferredPrompt;

// Listen for the beforeinstallprompt event
window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    
    // Stash the event so it can be triggered later
    deferredPrompt = e;
    
    // Show the install button
    const pwaInstallBtn = document.getElementById('pwa-install-btn');
    if (pwaInstallBtn) {
        pwaInstallBtn.style.display = 'inline-block';
        
        // Add click handler to the install button
        pwaInstallBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Hide the install button
            pwaInstallBtn.style.display = 'none';
            
            // Show the install prompt
            deferredPrompt.prompt();
            
            // Wait for the user to respond to the prompt
            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('User accepted the install prompt');
                } else {
                    console.log('User dismissed the install prompt');
                }
                
                // Clear the deferredPrompt variable
                deferredPrompt = null;
            });
        });
    }
});

// Hide the install button if the app is already installed
window.addEventListener('appinstalled', () => {
    console.log('PWA was installed');
    const pwaInstallBtn = document.getElementById('pwa-install-btn');
    if (pwaInstallBtn) {
        pwaInstallBtn.style.display = 'none';
    }
    deferredPrompt = null;
});

// Create a new file called translations.js in your assets/js directory

/**
 * DTAC 2025 Translations
 * This file contains translations for the website in English and Arabic
 */

// Complete translations object with all website text
const translations = {
    'en': {
        // Navigation
        'home': 'Home',
        'speakers': 'Speakers',
        'schedule': 'Schedule',
        'venue': 'Venue',
        'conference-roles': 'Conference Roles',
        'contact': 'Contact',
        'register-now': 'Register Now',
        'install-app': 'Install App',

        // Hero Section
        'about-conference': 'About The DTAC 2025 Conference',
        'conference-description': 'The DTAC 2025 Conference is a celebration of public speaking excellence, where participants showcase their oratory skills and leadership potential. The event brings together passionate speakers, mentors, and audiences, fostering a community of growth and inspiration.',
        'where': 'Where',
        'when': 'When',

        // Sponsors Section
        'sponsors': 'Sponsors',
        'sponsors-desc': 'We thank our esteemed sponsors whose generous support makes DTAC 2025 possible. Their commitment to excellence in communication and leadership development helps enrich our community.',

        // Speakers Section
        'speakers-title': 'Featured Speakers',
        'speakers-desc': 'Discover thought leaders and expert communicators who will inspire and empower you',
        'featured-speaker': 'Featured Speaker',
        'keynote-speaker': 'Keynote Speaker',

        // Speaker Positions and Topics
        'business-leader': 'Business Leader & Innovator',
        'transformational-leadership': 'The Secrets of Transformational Leadership: From Cultivating Culture to Inspiring Innovation',
        'ceo': 'Founder & CEO - Y Access Training Solutions',
        'why-me': 'Why Me? Don\'t be chosen. Be chased.',
        'become-speaker': 'How to become the world\'s number one speaker?',
        'wellbeing': 'Employee Wellbeing & Happiness',
        'leadership-question': 'The Frequently Asked Question: AM I a Leader',
        'investment': 'Who said "You have to be Rich" to invest?',
        'bridging-generations': 'Bridging Generations: Effective Communication Strategies between Adults & Children',
        'personal-branding': 'Personal Branding with LinkedIn',
        'resilience': 'The Power of Resilience',

        // Schedule Section
        'schedule-title': 'Event Schedule',
        'schedule-desc': 'Discover the exciting lineup of speeches, workshops, and activities at DTAC 2025',
        'day-1': 'Day 1: Thursday',
        'day-2': 'Day 2: Friday',
        'day-3': 'Day 3: Saturday',
        'morning-session': 'Morning Session (English)',
        'afternoon-session': 'Afternoon Session (Arabic)',

        // Common Schedule Items
        'opening': 'Opening & Welcome',
        'master-ceremonies': 'Master of Ceremonies',
        'keynote-speech': 'Keynote Speech',
        'call-order': 'Call to Order',
        'prayer-break': 'Prayer break',
        'entertainment': 'Entertainment Scoop – Audience Engagement Activity',

        // Workshops Section
        'workshops': 'Workshops',
        'workshops-desc': 'Enhance your skills with specialized workshops throughout the conference',
        'english-workshops': 'English Workshops',
        'arabic-workshops': 'Arabic Workshops',

        // Venue Section
        'event-venue': 'Event Venue',
        'venue-desc': 'Experience the grandeur of DTAC 25 at the prestigious Crowne Plaza venue',
        'venue-location': 'Crowne Plaza Conference Center',
        'venue-description': 'Located in the heart of Manama, this premium venue offers state-of-the-art facilities and excellent accessibility for all participants.',

        // Registration Section
        'registration': 'Registration',
        'registration-info': 'Online registration is now closed. On-spot registration will be available at the venue.',
        'standard-registration': 'Standard Registration',
        'onspot-registration': 'On-Spot Registration',
        'registration-closed': 'Registration Closed',
        'available-at-venue': 'Available at Venue',

        // Conference Roles Section
        'conference-roles-title': 'Conference Roles',
        'conference-roles-desc': 'Join the English Education Committee and help make DTAC 2025 a success!',
        'important-dates': 'Important Dates',
        'nomination-deadline': 'Nomination Deadline',
        'conference-dates': 'Conference Dates',
        'be-part': 'Be Part of Something Great',
        'step-up': 'Step up, make connections, and contribute to an unforgettable event.',
        'apply-now': 'Apply Now',

        // Contact Section
        'contact-us': 'Contact Us',
        'contact-desc': 'Get in touch with our organizing team for any inquiries about DTAC 2025',
        'venue-location-title': 'Venue Location',
        'call-us': 'Call Us',
        'call-us-desc': 'Our team is available to answer your queries',
        'email-us': 'Email Us',
        'email-us-desc': 'For registration and general inquiries',
        'connect': 'Connect With Us',
        'connect-desc': 'Follow us on social media for updates and announcements',
        'response-time': 'Typical response time: Within 24 hours',

        // Quick Links
        'registration-link': 'Registration',
        'venue-details': 'Venue Details',
        'event-schedule': 'Event Schedule',
        'speakers-link': 'Speakers',

        // Footer
        'phone': 'Phone:',
        'email': 'Email:',
        'useful-links': 'Useful Links',
        'social-media': 'Social Media'
    },
    'ar': {
        // Navigation
        'home': 'الرئيسية',
        'speakers': 'المتحدثون',
        'schedule': 'جدول الأعمال',
        'venue': 'المكان',
        'conference-roles': 'أدوار المؤتمر',
        'contact': 'تواصل معنا',
        'register-now': 'سجل الآن',
        'install-app': 'تثبيت التطبيق',

        // Hero Section
        'about-conference': 'حول مؤتمر DTAC 2025',
        'conference-description': 'مؤتمر DTAC 2025 هو احتفال بالتميز في الخطابة العامة، حيث يعرض المشاركون مهاراتهم الخطابية وإمكاناتهم القيادية. يجمع الحدث المتحدثين المتحمسين والموجهين والجماهير، مما يعزز مجتمعًا من النمو والإلهام.',
        'where': 'أين',
        'when': 'متى',

        // Sponsors Section
        'sponsors': 'الرعاة',
        'sponsors-desc': 'نشكر رعاتنا المحترمين الذين يجعلون مؤتمر DTAC 2025 ممكنًا بدعمهم السخي. إن التزامهم بالتميز في التواصل وتطوير القيادة يساعد على إثراء مجتمعنا.',

        // Speakers Section
        'speakers-title': 'المتحدثون المميزون',
        'speakers-desc': 'اكتشف قادة الفكر والمتحدثين الخبراء الذين سيلهمونك ويمكنونك',
        'featured-speaker': 'متحدث مميز',
        'keynote-speaker': 'المتحدث الرئيسي',

        // Speaker Positions and Topics
        'business-leader': 'قائد أعمال ومبتكر',
        'transformational-leadership': 'أسرار القيادة التحويلية: من زراعة الثقافة إلى إلهام الابتكار',
        'ceo': 'المؤسس والرئيس التنفيذي - حلول تدريب واي أكسس',
        'why-me': 'لماذا أنا؟ لا تكن مختارًا. كن مطاردًا.',
        'become-speaker': 'كيف تصبح المتحدث رقم واحد في العالم؟',
        'wellbeing': 'رفاهية وسعادة الموظفين',
        'leadership-question': 'السؤال المتكرر: هل أنا قائد',
        'investment': 'من قال "يجب أن تكون ثرياً" للاستثمار؟',
        'bridging-generations': 'سد الفجوة بين الأجيال: استراتيجيات التواصل الفعال بين البالغين والأطفال',
        'personal-branding': 'العلامة التجارية الشخصية مع لينكد إن',
        'resilience': 'قوة المرونة',

        // Schedule Section
        'schedule-title': 'جدول الفعاليات',
        'schedule-desc': 'اكتشف المجموعة المثيرة من الخطابات وورش العمل والأنشطة في DTAC 2025',
        'day-1': 'اليوم الأول: الخميس',
        'day-2': 'اليوم الثاني: الجمعة',
        'day-3': 'اليوم الثالث: السبت',
        'morning-session': 'الجلسة الصباحية (الإنجليزية)',
        'afternoon-session': 'الجلسة المسائية (العربية)',

        // Common Schedule Items
        'opening': 'الافتتاح والترحيب',
        'master-ceremonies': 'مدير الاحتفال',
        'keynote-speech': 'الكلمة الرئيسية',
        'call-order': 'دعوة للنظام',
        'prayer-break': 'استراحة الصلاة',
        'entertainment': 'فقرة ترفيهية - نشاط إشراك الجمهور',

        // Workshops Section
        'workshops': 'ورش العمل',
        'workshops-desc': 'عزز مهاراتك من خلال ورش عمل متخصصة طوال المؤتمر',
        'english-workshops': 'ورش العمل الإنجليزية',
        'arabic-workshops': 'ورش العمل العربية',

        // Venue Section
        'event-venue': 'مكان الحدث',
        'venue-desc': 'استمتع بفخامة DTAC 25 في مكان كراون بلازا المرموق',
        'venue-location': 'مركز مؤتمرات كراون بلازا',
        'venue-description': 'يقع في قلب المنامة، يوفر هذا المكان المتميز مرافق حديثة وإمكانية وصول ممتازة لجميع المشاركين.',

        // Registration Section
        'registration': 'التسجيل',
        'registration-info': 'التسجيل عبر الإنترنت مغلق الآن. سيكون التسجيل في الموقع متاحًا في المكان.',
        'standard-registration': 'التسجيل القياسي',
        'onspot-registration': 'التسجيل في الموقع',
        'registration-closed': 'التسجيل مغلق',
        'available-at-venue': 'متاح في المكان',

        // Conference Roles Section
        'conference-roles-title': 'أدوار المؤتمر',
        'conference-roles-desc': 'انضم إلى لجنة التعليم الإنجليزي وساعد في جعل DTAC 2025 ناجحًا!',
        'important-dates': 'تواريخ مهمة',
        'nomination-deadline': 'الموعد النهائي للترشيح',
        'conference-dates': 'تواريخ المؤتمر',
        'be-part': 'كن جزءًا من شيء عظيم',
        'step-up': 'تقدم، وقم بإنشاء روابط، وساهم في حدث لا يُنسى.',
        'apply-now': 'تقدم الآن',

        // Contact Section
        'contact-us': 'تواصل معنا',
        'contact-desc': 'تواصل مع فريق التنظيم لدينا لأي استفسارات حول DTAC 2025',
        'venue-location-title': 'موقع المكان',
        'call-us': 'اتصل بنا',
        'call-us-desc': 'فريقنا متاح للإجابة على استفساراتك',
        'email-us': 'راسلنا',
        'email-us-desc': 'للتسجيل والاستفسارات العامة',
        'connect': 'تواصل معنا',
        'connect-desc': 'تابعنا على وسائل التواصل الاجتماعي للحصول على التحديثات والإعلانات',
        'response-time': 'وقت الرد النموذجي: خلال 24 ساعة',

        // Quick Links
        'registration-link': 'التسجيل',
        'venue-details': 'تفاصيل المكان',
        'event-schedule': 'جدول الفعاليات',
        'speakers-link': 'المتحدثون',

        // Footer
        'phone': 'الهاتف:',
        'email': 'البريد الإلكتروني:',
        'useful-links': 'روابط مفيدة',
        'social-media': 'وسائل التواصل الاجتماعي'
    }
};

// Expose translations for use in main.js
window.siteTranslations = translations;