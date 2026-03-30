/* --- reactions_final.js: GIỮ NGUYÊN QUỲ TÍM FILE A + LOGIC FILE B --- */

(function injectReactionStyles() {
    if (document.getElementById('reaction-styles')) return;
    const style = document.createElement('style');
    style.id = 'reaction-styles';
    style.innerHTML = `
        .bubble {
            position: absolute; 
            background: rgba(255, 255, 255, 0.4);
            border: 0.5px solid rgba(255, 255, 255, 0.7);
            border-radius: 50%; 
            animation: bubbleUp 3s infinite ease-in; 
            z-index: 10;
            pointer-events: none;
        }
        @keyframes bubbleUp {
            0% { transform: translateY(0) scale(0.4); opacity: 0; }
            20% { opacity: 1; }
            100% { transform: translateY(-120px) scale(1.2); opacity: 0; }
        }

        .liq-upper-blur { filter: blur(0.3px); }

        .precipitate-solid {
            box-shadow: 
                inset 10px 0 15px rgba(255,255,255,0.6), 
                inset -10px 0 15px rgba(0,0,0,0.05),
                0 -2px 5px rgba(255,255,255,0.3);
        }

        .copper-coated {
            filter: sepia(1) saturate(5) hue-rotate(-30deg) brightness(0.8) !important;
            position: absolute;
            top: 0; left: 0;
            pointer-events: none;
        }
        .iron-nail-wrapper { position: relative; display: inline-block; }
    `;
    document.head.appendChild(style);
})();

const LabReactions = {
    apply: function(container, effectText, isLitmus = false) {
        const liq = container.querySelector('.liquid-layer');
        const text = effectText ? effectText.toLowerCase() : "";
        
        // --- 1. XỬ LÝ RIÊNG CHO GIẤY QUỲ TÍM (VẬT RẮN) ---
        // Khi nhúng giấy quỳ vào dung dịch, chỉ đổi màu chính cái giấy đó
        if (isLitmus) {
            const img = container.querySelector('img');
            if (img) {
                if (text.includes("đỏ")) {
                    img.style.filter = "sepia(1) saturate(20) hue-rotate(-50deg)";
                } else if (text.includes("xanh")) {
                    img.style.filter = "sepia(1) saturate(20) hue-rotate(180deg)";
                }
            }
            return; // Thoát để không làm đổi màu dung dịch lỏng bên dưới
        }

        if (!liq) return;

        // --- 2. LOGIC RESET ---
        if (!effectText || effectText === "") {
            liq.style.transition = "all 1s ease";
            const chemList = container.dataset.chemList || "";
            if (chemList.toLowerCase().includes("cuso4")) {
                liq.style.background = "rgba(0, 112, 255, 0.6)";
            } else {
                liq.style.background = "rgba(128, 128, 128, 0.2)";
            }
            liq.style.filter = "none";
            liq.style.boxShadow = "none";
            return; 
        }

        // --- 3. XỬ LÝ CHO DUNG DỊCH LỎNG (PHENOLPHTALEIN) ---
        liq.style.transition = "all 2s ease-out"; 

        // Ưu tiên kiểm tra hiệu ứng "màu hồng" cho Phenolphtalein trước
        if (text.includes("màu hồng") || text.includes("phenolphtalein")) {
            // Hiệu ứng hồng cánh sen đặc trưng của phenolphtalein trong môi trường kiềm
            liq.style.background = "linear-gradient(to bottom, rgba(255, 20, 147, 0.5) 0%, rgba(255, 0, 128, 0.8) 100%)";
            liq.style.boxShadow = "inset 0 0 15px rgba(255, 20, 147, 0.6)";
            liq.style.filter = "saturate(2) brightness(1.1)";
        }
        // Hiệu ứng xanh dương cho dung dịch (nếu có phản ứng khác hoặc dùng chỉ thị lỏng khác)
        else if (text.includes("xanh dương")) {
            liq.style.background = "rgba(0, 0, 255, 0.5)";
        }
        // --- 3. HIỆU ỨNG SỦI BỌT (FILE A) ---
        if (text.includes("sủi bọt")) this.createBubbles(container);

        // --- 4. CÁC PHẢN ỨNG HÓA HỌC ---

        // A. HIỆU ỨNG ĐỎ GẠCH / ĐỎ NÂU (LOGIC FILE B)
        if (text.includes("đỏ gạch") || text.includes("đỏ nâu")) {
            liq.style.background = "linear-gradient(to bottom, rgba(0, 191, 255, 0.1) 0%, rgba(0, 80, 200, 0.2) 100%)";
            
            document.querySelectorAll('.draggable-item img').forEach(img => {
                if (img.src.includes("Dinhsat")) {
                    const ironRect = img.getBoundingClientRect();
                    const contRect = container.getBoundingClientRect();
                    const isColliding = !(ironRect.right < contRect.left || ironRect.left > contRect.right || 
                                         ironRect.bottom < contRect.top || ironRect.top > contRect.bottom);
                    
                    if (isColliding && !img.parentElement.querySelector('.copper-coated')) {
                        if (!img.parentElement.classList.contains('iron-nail-wrapper')) {
                            const wrapper = document.createElement('div');
                            wrapper.className = 'iron-nail-wrapper';
                            img.parentNode.insertBefore(wrapper, img);
                            wrapper.appendChild(img);
                        }
                        const coat = img.cloneNode(true);
                        coat.classList.add('copper-coated');
                        img.parentElement.appendChild(coat);
                    }
                }
            });
        }

            // HIỆU ỨNG: TRÁNG GƯƠNG (Glucose + AgNO3)
            else if (text.includes("gương") || text.includes("sáng bóng")) {
                liq.style.background = `linear-gradient(135deg, 
                    #bdc3c7 0%, #eff2f3 25%, #95a5a6 50%, #ffffff 75%, #bdc3c7 100%)`;
                liq.style.boxShadow = "inset 0 0 20px rgba(255,255,255,0.8)";
                liq.style.filter = "brightness(1.2) contrast(1.1)";
            }


        // C. KẾT TỦA TRẮNG (SIÊU NÉT FILE A)
        else if (text.includes("trắng")) {
            liq.style.background = `linear-gradient(to bottom, 
                rgba(255, 255, 255, 0.1) 0%, 
                rgba(255, 255, 255, 0.2) 55%, 
                rgba(255, 255, 255, 1) 60%, 
                rgba(240, 240, 240, 1) 100%)`;
            liq.classList.add("precipitate-solid");
            liq.style.filter = "contrast(1.3) brightness(1.1)";
        }

        // D. KẾT TỦA XANH LƠ (FILE A)
        else if (text.includes("xanh lơ")) {
            liq.style.background = `linear-gradient(to bottom, rgba(0, 191, 255, 0.2) 0%, rgba(0, 191, 255, 0.2) 60%, rgba(0, 150, 255, 1) 62%, rgba(0, 100, 255, 1) 100%)`;
            liq.classList.add("precipitate-solid");
        } 

        // E. XANH TÍM (FILE A)
        else if (text.includes("xanh tím")) {
            liq.style.background = "linear-gradient(to bottom, rgba(120, 100, 255, 0.6) 0%, rgba(60, 20, 255, 0.9) 100%)";
        }
    },

    createBubbles: function(container) {
        const liq = container.querySelector('.liquid-layer');
        if (!liq) return;
        const liqWidth = parseFloat(liq.style.width) || 20;
        const liqLeft = parseFloat(liq.style.left) || 40;
        const targetArea = container.querySelector('.glass-container') || container;
        
        if (targetArea.querySelectorAll('.bubble').length > 15) return;

        for (let i = 0; i < 15; i++) {
            setTimeout(() => {
                const b = document.createElement('div');
                b.className = 'bubble';
                const innerX = (Math.random() * 0.6 + 0.2) * liqWidth; 
                b.style.left = (liqLeft + innerX) + "%";
                b.style.bottom = "40px";
                const size = (Math.random() * 3 + 2);
                b.style.width = size + "px";
                b.style.height = size + "px";
                b.style.animationDelay = (Math.random() * 1) + "s";
                targetArea.appendChild(b);
            }, i * 150);
        }
    }
};