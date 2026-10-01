// Modern Personal Website Scripts
document.addEventListener('DOMContentLoaded', function() {
    
    // Language switching functionality
    const languageSwitcher = {
        currentLang: 'zh',
        translations: {
            zh: {
                'brand-text': 'Barack Liu',
                'nav-about': '关于我',
                'nav-skills': '技能',
                'nav-experience': '经历',
                'nav-portfolio': '手绘集',
                'nav-contact': '联系',
                'hero-name': 'Barack Liu',
                'hero-subtitle': '3年创业经验 | 2年微软客户工程师 | 华盛顿大学计算机科学硕士',
                'hero-learn-more': '了解更多',
                'hero-contact': '联系我',
                'section-about': '关于我',

                'section-experience': '工作经历',
                'section-portfolio': '手绘集',
                'section-contact': '联系方式',
                'skills-computer': '计算机技术',
                'skills-fintech': '金融科技',
                'skills-design': '产品与设计',
                'skills-fintech-dual': '金融学双学位',
                'skills-blockchain': '区块链研究方向',
                'skills-fintech-apps': '金融科技应用',
                'skills-product-design': '产品设计',
                'skills-ux': '用户体验',
                'about-summary': '个人简介',
                'about-summary-text': '3年创业经验 | 2年微软客户工程师 | 华盛顿大学计算机科学硕士',
                'experience-current-title': '数据运营工程师 (技术项目经理)',
                'experience-current-company': 'MAQ',
                'experience-current-period': '2024-2025',
                'experience-current-text': '深入分析现有系统和业务流程，识别用户需求，设计基于Power BI的云解决方案。创建详细的软件规范，通过Scrum、工作流程图和技术手册支持软件程序员和利益相关者。',
                'experience-microsoft-title': '客户工程师',
                'experience-microsoft-company': '微软',
                'experience-microsoft-period': '2020-2022',
                'experience-microsoft-text': '为50+顶级企业客户提供技术支持，包括应用程序部署、故障排除和研讨会。获得6项微软认证和69项微软现代工作认证。每年提供1400+小时的客户解决方案，客户满意度95%+。',
                'experience-tencent-title': '产品经理实习生',
                'experience-tencent-company': '腾讯',
                'experience-tencent-period': '2019',
                'experience-tencent-text': '进行市场研究和客户访谈，与50+微信顶级企业用户联络。使用敏捷方法定义产品愿景，分析产品需求、竞争分析和产品路线图。',
                'experience-entrepreneurship-title': '创始人 - 产品经理 & 客户工程师',
                'experience-entrepreneurship-company': '成启点信',
                'experience-entrepreneurship-period': '2014-2017',
                'experience-entrepreneurship-text': '为100+付费客户提供及时技术支持。领导工程团队开发软件应用，这是首个利用弹幕实现演讲者与观众实时互动的应用，3年内服务30万+用户。成功获得15万美元种子轮投资。',
                'nav-education': '教育',
                'nav-publications': '论文专利',
                'section-education': '教育背景',
                'section-publications': '论文与专利',
                'education-uw-title': '计算机科学与软件工程硕士',
                'education-uw-institution': '华盛顿大学',
                'education-uw-period': '2024',
                'education-uw-details': 'GPA: 3.74/4.0<br>2023 Mentorship EDGE Mentees of the Year Tuition Scholarship Award',
                'education-sjtu-title': '计算机技术工程硕士',
                'education-sjtu-institution': '上海交通大学',
                'education-sjtu-period': '2020',
                'education-sjtu-details': 'GPA: 3.88/4.0<br>排名: 前5%<br>2020年上海市优秀毕业生',
                'education-hust-title': '电子信息工程学士 (主修) + 经济学学士 (辅修)',
                'education-hust-institution': '华中科技大学',
                'education-hust-period': '2017',
                'education-hust-details': '启明学院优秀毕业生',
                'publication-blockchain': '区块链论文',
                'publication-blockchain-text': 'Liu, H., et al., 2019, August. A Secure and Practical Blockchain Scheme for IoT. In TrustCom 2019',
                'patent-barrage-review': '弹幕消息处理专利',
                'patent-barrage-review-text': 'Lin, F., Liu, H., A Method for Processing Barrage Messages with Review and Filtering [P]. ZL 2016 1 0941029.9',
                'patent-barrage-distribution': '弹幕分布方法专利',
                'patent-barrage-distribution-text': 'Lin, F., Liu, H., A Ballistic Distribution Method for Variable Speed Barrage [P]. ZL 2016 1 0951515.9',
                'portfolio-subtitle': '我的手绘作品展示',
                'contact-email': '邮箱',
                'social-media': '社交媒体',
                '豆瓣': '豆瓣',
                'Douban': 'Douban',
                'AI产品名：': 'AI产品名：',
                '宏依': '宏依',
                '起点': '起点',
                'Qidian': 'Qidian',
                'footer-copyright': '保留所有权利。'
            },
            en: {
                'brand-text': 'Barack Liu',

                'nav-skills': 'Skills',
                'nav-experience': 'Experience',
                'nav-portfolio': 'Sketches',
                'nav-contact': 'Contact',
                'hero-name': 'Barack Liu',
                'hero-subtitle': '3-year Entrepreneurship | 2-year Customer Engineer at Microsoft | Master\'s Degree in Computer Science at UW',
                'hero-learn-more': 'Learn More',
                'hero-contact': 'Contact Me',


                'section-experience': 'Work Experience',
                'section-portfolio': 'Sketches',
                'section-contact': 'Contact Me',
                'skills-computer': 'Computer Technology',
                'skills-fintech': 'FinTech',
                'skills-design': 'Product & Design',
                'skills-fintech-dual': 'Dual degree in Finance',
                'skills-blockchain': 'Blockchain research focus',
                'skills-fintech-apps': 'FinTech applications',
                'skills-product-design': 'Product Design',
                'skills-ux': 'UX Design',

                'experience-current-title': 'Data Operation Engineer (Technical Project Manager)',
                'experience-current-company': 'MAQ',
                'experience-current-period': '2024-2025',
                'experience-current-text': 'Conducted in-depth analysis of existing systems and business processes to identify user requirements, design cloud-based solutions leveraging Power BI. Created detailed software specifications through Scrum, workflow diagrams, and technical manuals.',
                'experience-microsoft-title': 'Customer Engineer',
                'experience-microsoft-company': 'Microsoft',
                'experience-microsoft-period': '2020-2022',
                'experience-microsoft-text': 'Provided technical support including application deployment, troubleshooting, and workshops for 50+ top enterprise clients. Earned 6 Microsoft Certifications and 69 Microsoft Accreditations. Delivered 1,400+ hours of customer-facing solutions per year with 95%+ customer satisfaction.',
                'experience-tencent-title': 'Product Manager Intern',
                'experience-tencent-company': 'Tencent',
                'experience-tencent-period': '2019',
                'experience-tencent-text': 'Conducted market research and client interviews to liaise with 50+ top enterprise users of WeChat. Utilized Agile to define production vision, analyzing product requirements, competitive analysis, and product roadmap.',
                'experience-entrepreneurship-title': 'Founder - Product Manager & Customer Engineer',
                'experience-entrepreneurship-company': 'Cheng Qi Dian Xin',
                'experience-entrepreneurship-period': '2014-2017',
                'experience-entrepreneurship-text': 'Provided timely technical support to 100+ paying customers per year. Led engineering team to develop software applications, the 1st to utilize barrage for real-time speaker-audience interaction, serving 300,000+ users in 3 years. Successfully obtained 150,000 USD in seed round investment.',
                'nav-education': 'Education',
                'nav-publications': 'Publications',
                'section-education': 'Education',
                'section-publications': 'Publications & Patents',
                'education-uw-title': 'Master of Science in Computer Science and Software Engineering',
                'education-uw-institution': 'University of Washington',
                'education-uw-period': '2024',
                'education-uw-details': 'GPA: 3.74/4.0<br>2023 Mentorship EDGE Mentees of the Year Tuition Scholarship Award',
                'education-sjtu-title': 'Master of Engineering in Computer Technology',
                'education-sjtu-institution': 'Shanghai Jiao Tong University',
                'education-sjtu-period': '2020',
                'education-sjtu-details': 'GPA: 3.88/4.0<br>Ranking: Top 5%<br>Outstanding Graduates of Shanghai in 2020',
                'education-hust-title': 'Bachelor of Engineering in Electronic Information Engineering (Major) + Bachelor of Economics (Minor)',
                'education-hust-institution': 'Huazhong University of Science and Technology',
                'education-hust-period': '2017',
                'education-hust-details': 'Outstanding Graduate of Qiming College',
                'publication-blockchain': 'Blockchain Publication',
                'publication-blockchain-text': 'Liu, H., et al., 2019, August. A Secure and Practical Blockchain Scheme for IoT. In TrustCom 2019',
                'patent-barrage-review': 'Barrage Message Processing Patent',
                'patent-barrage-review-text': 'Lin, F., Liu, H., A Method for Processing Barrage Messages with Review and Filtering [P]. ZL 2016 1 0941029.9',
                'patent-barrage-distribution': 'Barrage Distribution Method Patent',
                'patent-barrage-distribution-text': 'Lin, F., Liu, H., A Ballistic Distribution Method for Variable Speed Barrage [P]. ZL 2016 1 0951515.9',
                'portfolio-subtitle': 'My Hand-drawn Artwork Collection',
                'contact-email': 'Email',
                'social-media': 'Social Media',
                '豆瓣': 'Douban',
                'Douban': 'Douban',
                'AI产品名：': 'AI Product: ',
                '宏依': 'Hongyi.ai',
                '起点': 'Qidian',
                'Qidian': 'Qidian',
                'footer-copyright': 'All rights reserved.',
                '柯南': 'Conan',
                'Conan': 'Conan',
                '灰原哀': 'Ai Haibara',
                'Ai Haibara': 'Ai Haibara',
                '艾斯': 'Ace',
                'Ace': 'Ace',
                '游戏王': 'Yu-Gi-Oh!',
                'Yu-Gi-Oh!': 'Yu-Gi-Oh!',
                '爱因斯坦': 'Einstein',
                'Einstein': 'Einstein',
                '犬夜叉': 'Inuyasha',
                'Inuyasha': 'Inuyasha',
                '疯狂动物城': 'Zootopia',
                'Zootopia': 'Zootopia',
                '不知火舞': 'Mai Shiranui',
                'Mai Shiranui': 'Mai Shiranui',
                '蛇姬': 'Boa Hancock',
                'Boa Hancock': 'Boa Hancock',
                '你的名字': 'Your Name',
                'Your Name': 'Your Name',
                '周恩来': 'Zhou Enlai',
                'Zhou Enlai': 'Zhou Enlai',
                '罗宾': 'Robin',
                'Robin': 'Robin',
                '乔巴': 'Chopper',
                'Chopper': 'Chopper',
                '东海龙王': 'Dragon King',
                'Dragon King': 'Dragon King',
                '索隆': 'Zoro',
                'Zoro': 'Zoro',
                '田园风光': 'Rural Landscape',
                'Rural Landscape': 'Rural Landscape',
                '香吉士': 'Sanji',
                'Sanji': 'Sanji',
                '我要读书': 'I Want to Study',
                'I Want to Study': 'I Want to Study',
                '游园惊梦': 'Dream in the Garden',
                'Dream in the Garden': 'Dream in the Garden',
                '王下七武海': 'Seven Warlords',
                'Seven Warlords': 'Seven Warlords',
                '佚名': 'Anonymous',
                'Anonymous': 'Anonymous',
                '草薙京': 'Kyo Kusanagi',
                'Kyo Kusanagi': 'Kyo Kusanagi',
                '哆啦A梦': 'Doraemon',
                'Doraemon': 'Doraemon',
                '海贼王-路飞': 'One Piece - Luffy',
                'One Piece - Luffy': 'One Piece - Luffy',
                '蜡笔小新': 'Crayon Shin-chan',
                'Crayon Shin-chan': 'Crayon Shin-chan',
                '速写-凯旋门': 'Sketch - Arc de Triomphe',
                'Sketch - Arc de Triomphe': 'Sketch - Arc de Triomphe',
                '神乐': 'Kagura',
                'Kagura': 'Kagura',
                '速写-东大门': 'Sketch - Dongdaemun',
                'Sketch - Dongdaemun': 'Sketch - Dongdaemun',
                '皮卡丘': 'Pikachu',
                'Pikachu': 'Pikachu',
                '速写-电信群楼': 'Sketch - Telecom Building',
                'Sketch - Telecom Building': 'Sketch - Telecom Building',
                '怪盗基德': 'Kaitou Kid',
                'Kaitou Kid': 'Kaitou Kid',
                '速写-I LOVE SJTU': 'Sketch - I LOVE SJTU',
                'Sketch - I LOVE SJTU': 'Sketch - I LOVE SJTU',
                'やつがれを見たミ!!': 'やつがれを見たミ!!',
                '柯南': '柯南',
                'Conan': 'Conan',
                '灰原哀': '灰原哀',
                'Ai Haibara': 'Ai Haibara',
                '艾斯': '艾斯',
                'Ace': 'Ace',
                '游戏王': '游戏王',
                'Yu-Gi-Oh!': 'Yu-Gi-Oh!',
                '爱因斯坦': '爱因斯坦',
                'Einstein': 'Einstein',
                '犬夜叉': '犬夜叉',
                'Inuyasha': 'Inuyasha',
                '疯狂动物城': '疯狂动物城',
                'Zootopia': 'Zootopia',
                '不知火舞': '不知火舞',
                'Mai Shiranui': 'Mai Shiranui',
                '蛇姬': '蛇姬',
                'Boa Hancock': 'Boa Hancock',
                '你的名字': '你的名字',
                'Your Name': 'Your Name',
                '周恩来': '周恩来',
                'Zhou Enlai': 'Zhou Enlai',
                '罗宾': '罗宾',
                'Robin': 'Robin',
                '乔巴': '乔巴',
                'Chopper': 'Chopper',
                '东海龙王': '东海龙王',
                'Dragon King': 'Dragon King',
                '索隆': '索隆',
                'Zoro': 'Zoro',
                '田园风光': '田园风光',
                'Rural Landscape': 'Rural Landscape',
                '香吉士': '香吉士',
                'Sanji': 'Sanji',
                '我要读书': '我要读书',
                'I Want to Study': 'I Want to Study',
                '游园惊梦': '游园惊梦',
                'Dream in the Garden': 'Dream in the Garden',
                '王下七武海': '王下七武海',
                'Seven Warlords': 'Seven Warlords',
                '佚名': '佚名',
                'Anonymous': 'Anonymous',
                '草薙京': '草薙京',
                'Kyo Kusanagi': 'Kyo Kusanagi',
                '哆啦A梦': '哆啦A梦',
                'Doraemon': 'Doraemon',
                '海贼王-路飞': '海贼王-路飞',
                'One Piece - Luffy': 'One Piece - Luffy',
                '蜡笔小新': '蜡笔小新',
                'Crayon Shin-chan': 'Crayon Shin-chan',
                '速写-凯旋门': '速写-凯旋门',
                'Sketch - Arc de Triomphe': 'Sketch - Arc de Triomphe',
                '神乐': '神乐',
                'Kagura': 'Kagura',
                '速写-东大门': '速写-东大门',
                'Sketch - Dongdaemun': 'Sketch - Dongdaemun',
                '皮卡丘': '皮卡丘',
                'Pikachu': 'Pikachu',
                '速写-电信群楼': '速写-电信群楼',
                'Sketch - Telecom Building': 'Sketch - Telecom Building',
                '怪盗基德': '怪盗基德',
                'Kaitou Kid': 'Kaitou Kid',
                '速写-I LOVE SJTU': '速写-I LOVE SJTU',
                'Sketch - I LOVE SJTU': 'Sketch - I LOVE SJTU',
                'やつがれを見たミ!!': 'やつがれを見たミ!!'
            }
        },

        init() {
            this.bindEvents();
            this.updateContent();
        },

        bindEvents() {
            const langButtons = document.querySelectorAll('.lang-btn');
            langButtons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const lang = e.target.dataset.lang;
                    this.switchLanguage(lang);
                });
            });
        },

        switchLanguage(lang) {
            this.currentLang = lang;
            
            // Update active button
            document.querySelectorAll('.lang-btn').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.lang === lang);
            });

            // Update content
            this.updateContent();
        },

        updateContent() {
            const elements = document.querySelectorAll('[data-zh], [data-en]');
            elements.forEach(element => {
                const key = this.currentLang === 'zh' ? element.dataset.zh : element.dataset.en;
                if (key && this.translations[this.currentLang][key]) {
                    element.innerHTML = this.translations[this.currentLang][key];
                } else if (key) {
                    // Fallback to the key itself if no translation is found
                    element.innerHTML = key;
                }
            });
        }
    };

    // Initialize language switcher
    languageSwitcher.init();

    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Navbar background on scroll
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.about-card, .skill-card, .timeline-content, .portfolio-item, .contact-card');
    animateElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });

    // Portfolio item hover effects and click to enlarge
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const closeBtn = document.querySelector('.close');

    portfolioItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.querySelector('.portfolio-overlay').style.transform = 'translateY(0)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.querySelector('.portfolio-overlay').style.transform = 'translateY(100%)';
        });

        // Click to enlarge functionality
        item.addEventListener('click', function() {
            const imgSrc = this.getAttribute('data-img');
            const title = this.getAttribute('data-title');
            modalImg.src = imgSrc;
            
            // Use translated title based on current language
            const currentLang = languageSwitcher.currentLang;
            const translatedTitle = languageSwitcher.translations[currentLang][title] || title;
            modalTitle.textContent = translatedTitle;
            
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    });

    // Close modal functionality
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal.style.display === 'block') {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // Social media link hover effects
    const socialLinks = document.querySelectorAll('.social-link');
    socialLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Timeline animation
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.2}s`;
    });

    // Add loading animation
    document.body.classList.add('loading');

    // Initialize tooltips for Bootstrap
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Mobile menu toggle
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    if (navbarToggler && navbarCollapse) {
        navbarToggler.addEventListener('click', () => {
            navbarCollapse.classList.toggle('show');
        });

        // Close mobile menu when clicking on a link
        const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navbarCollapse.classList.remove('show');
            });
        });
    }

    // Parallax effect for hero section
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroSection = document.querySelector('.hero-section');
        if (heroSection) {
            const rate = scrolled * -0.5;
            heroSection.style.transform = `translateY(${rate}px)`;
        }
    });

    // Add scroll progress indicator
    const createScrollProgress = () => {
        const progressBar = document.createElement('div');
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background: linear-gradient(90deg, var(--primary-color), var(--accent-color));
            z-index: 9999;
            transition: width 0.1s ease;
        `;
        document.body.appendChild(progressBar);

        window.addEventListener('scroll', () => {
            const scrollTop = document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / scrollHeight) * 100;
            progressBar.style.width = scrollPercent + '%';
        });
    };

    createScrollProgress();

    // Add typing effect to hero title
    const addTypingEffect = () => {
        const heroTitle = document.querySelector('.hero-title .name');
        if (heroTitle) {
            const text = heroTitle.textContent;
            heroTitle.textContent = '';
            let i = 0;
            
            const typeWriter = () => {
                if (i < text.length) {
                    heroTitle.textContent += text.charAt(i);
                    i++;
                    setTimeout(typeWriter, 100);
                }
            };
            
            setTimeout(typeWriter, 500);
        }
    };

    // Initialize typing effect after page load
    setTimeout(addTypingEffect, 1000);

    // Add particle background effect
    const createParticles = () => {
        const heroSection = document.querySelector('.hero-section');
        if (!heroSection) return;

        const particleContainer = document.createElement('div');
        particleContainer.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
            z-index: 1;
        `;

        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: 2px;
                height: 2px;
                background: rgba(255, 255, 255, 0.5);
                border-radius: 50%;
                animation: float ${Math.random() * 10 + 10}s linear infinite;
                left: ${Math.random() * 100}%;
                animation-delay: ${Math.random() * 10}s;
            `;
            particleContainer.appendChild(particle);
        }

        heroSection.appendChild(particleContainer);

        // Add CSS for particle animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes float {
                0% {
                    transform: translateY(100vh) rotate(0deg);
                    opacity: 0;
                }
                10% {
                    opacity: 1;
                }
                90% {
                    opacity: 1;
                }
                100% {
                    transform: translateY(-100px) rotate(360deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    };

    createParticles();

    // Add scroll to top button
    const createScrollToTop = () => {
        const scrollBtn = document.createElement('button');
        scrollBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
        scrollBtn.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: var(--primary-color);
            color: white;
            border: none;
            cursor: pointer;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            z-index: 1000;
            box-shadow: var(--shadow-lg);
        `;

        document.body.appendChild(scrollBtn);

        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                scrollBtn.style.opacity = '1';
                scrollBtn.style.visibility = 'visible';
            } else {
                scrollBtn.style.opacity = '0';
                scrollBtn.style.visibility = 'hidden';
            }
        });

        scrollBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    };

    createScrollToTop();

    console.log('Modern personal website scripts loaded successfully!');
});
