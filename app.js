// EXTREME SPARK GENERATOR (50 Sparks)
document.addEventListener("DOMContentLoaded", () => {
    const pZone = document.getElementById('sparks');
    for(let i=0; i<50; i++) {
        let p = document.createElement('div');
        p.className = 'spark';
        p.style.width = `${Math.random() * 8 + 2}px`;
        p.style.height = p.style.width;
        p.style.left = `${Math.random() * 100}vw`;
        p.style.animationDuration = `${Math.random() * 5 + 3}s`;
        p.style.animationDelay = `${Math.random() * 3}s`;
        pZone.appendChild(p);
    }
});

function createRowHTML(index) {
    return `
        <input type="text" class="cyber-input" placeholder="Course ${index}" autocomplete="off">
        <input type="number" class="cyber-input credit-input" placeholder="Credit" min="1" step="0.5">
        <div class="custom-select">
            <select class="grade-select">
                <option value="" disabled selected>Grade</option>
                <option value="4.00">A+ (4.00)</option>
                <option value="3.75">A  (3.75)</option>
                <option value="3.50">A- (3.50)</option>
                <option value="3.25">B+ (3.25)</option>
                <option value="3.00">B  (3.00)</option>
                <option value="2.75">B- (2.75)</option>
                <option value="2.50">C+ (2.50)</option>
                <option value="2.25">C  (2.25)</option>
                <option value="2.00">D  (2.00)</option>
                <option value="0.00">F  (0.00)</option>
            </select>
        </div>
        <button class="delete-btn" onclick="removeRow(this)"><i class="fa-solid fa-xmark"></i></button>
    `;
}

// SETUP PHASE: Generate rows
function generateRows() {
    const input = document.getElementById('course-count-input');
    const count = parseInt(input.value);
    const errorMsg = document.getElementById('setup-error');

    if(isNaN(count) || count < 1 || count > 15) {
        errorMsg.classList.remove('hidden');
        input.classList.add('error-shake');
        setTimeout(() => input.classList.remove('error-shake'), 400);
        return;
    }

    errorMsg.classList.add('hidden');
    const list = document.getElementById('course-list');
    list.innerHTML = ''; 

    for(let i = 0; i < count; i++) {
        const row = document.createElement('div');
        row.className = 'course-row';
        row.style.animationDelay = `${i * 0.05}s`; // Faster staggered animation
        row.innerHTML = createRowHTML(i + 1);
        list.appendChild(row);
    }

    document.getElementById('setup-phase').classList.add('hidden');
    const calculatorCore = document.getElementById('calculator-core');
    calculatorCore.classList.remove('hidden');
    
    calculatorCore.querySelectorAll('.slide-up, .slide-up-delay').forEach(el => {
        el.style.animation = 'none';
        void el.offsetWidth; 
        el.style.animation = null;
    });
}

function addSingleCourse() {
    const list = document.getElementById('course-list');
    const currentCount = list.children.length;
    const row = document.createElement('div');
    row.className = 'course-row';
    row.innerHTML = createRowHTML(currentCount + 1);
    list.appendChild(row);
    list.scrollTop = list.scrollHeight;
}

function removeRow(button) {
    const row = button.parentElement;
    row.style.transform = 'scale(0.5) rotate(-10deg) translateY(50px)';
    row.style.opacity = '0';
    setTimeout(() => { 
        row.remove(); 
        document.querySelectorAll('.course-list .cyber-input[placeholder^="Course"]').forEach((inp, idx) => {
            if(!inp.value) inp.placeholder = `Course ${idx + 1}`;
        });
    }, 400);
}

function resetToSetup() {
    document.getElementById('course-count-input').value = '';
    document.getElementById('calculator-core').classList.add('hidden');
    
    const setupPhase = document.getElementById('setup-phase');
    setupPhase.classList.remove('hidden');
    
    const gpaElement = document.getElementById('final-gpa');
    gpaElement.innerText = "0.00";
    gpaElement.className = "font-code"; 
    document.getElementById('gpa-message').innerText = "SYSTEM STANDBY";
    document.getElementById('gpa-message').style.color = "var(--text-muted)";
    document.getElementById('total-credits').innerText = "0.0";
    document.getElementById('total-points').innerText = "0.00";
    document.getElementById('result-box').style.borderColor = "rgba(176, 38, 255, 0.3)";
    document.getElementById('result-box').style.boxShadow = "0 30px 60px rgba(0,0,0,0.8), inset 0 0 40px rgba(176, 38, 255, 0.1)";
}

// CALCULATION ENGINE
function triggerCalculation() {
    const btn = document.querySelector('.btn-calculate');
    const gpaElement = document.getElementById('final-gpa');
    const msgElement = document.getElementById('gpa-message');
    const resultBox = document.getElementById('result-box');

    const rows = document.querySelectorAll('.course-row');
    let totalCredits = 0;
    let totalPoints = 0;

    rows.forEach(row => {
        const creditInput = parseFloat(row.querySelector('.credit-input').value);
        const gradeInput = parseFloat(row.querySelector('.grade-select').value);
        if (!isNaN(creditInput) && !isNaN(gradeInput) && creditInput > 0) {
            totalCredits += creditInput;
            totalPoints += (creditInput * gradeInput);
        }
    });

    if (totalCredits === 0) {
        msgElement.innerText = "NO DATA ENTERED!";
        msgElement.style.color = "var(--danger)";
        gpaElement.innerText = "0.00";
        return;
    }

    btn.innerHTML = `<i class="fa-solid fa-atom fa-spin"></i> PROCESSING...`;
    btn.style.pointerEvents = "none";
    gpaElement.className = "font-code"; 
    resultBox.classList.add('processing');
    msgElement.innerText = "ANALYZING QUANTUM GRADES...";
    msgElement.style.color = "var(--primary)";

    const finalCGPA = totalPoints / totalCredits;

    setTimeout(() => {
        resultBox.classList.remove('processing');
        btn.innerHTML = `<i class="fa-solid fa-bolt"></i> CALCULATE CGPA`;
        btn.style.pointerEvents = "auto";
        
        document.getElementById('total-credits').innerText = totalCredits.toFixed(1);
        document.getElementById('total-points').innerText = totalPoints.toFixed(2);

        animateValue(gpaElement, 0.00, finalCGPA, 1000, () => {
            gpaElement.classList.add('reveal-pop');
            
            if(finalCGPA >= 3.80) { 
                gpaElement.classList.add('glow-excellent');
                msgElement.innerText = "EXCELLENT STANDING 🌟"; 
                msgElement.style.color = "var(--success)";
                resultBox.style.borderColor = "var(--success)";
                resultBox.style.boxShadow = "0 30px 60px rgba(0,0,0,0.9), inset 0 0 60px rgba(0, 255, 136, 0.3)";
            }
            else if(finalCGPA >= 3.00) { 
                gpaElement.classList.add('glow-good');
                msgElement.innerText = "GOOD PERFORMANCE 🚀"; 
                msgElement.style.color = "var(--primary)";
                resultBox.style.borderColor = "var(--primary)";
                resultBox.style.boxShadow = "0 30px 60px rgba(0,0,0,0.9), inset 0 0 60px rgba(0, 240, 255, 0.3)";
            }
            else if(finalCGPA >= 2.50) { 
                gpaElement.classList.add('glow-average');
                msgElement.innerText = "AVERAGE STANDING ⚠️"; 
                msgElement.style.color = "#f59e0b";
                resultBox.style.borderColor = "#f59e0b";
                resultBox.style.boxShadow = "0 30px 60px rgba(0,0,0,0.9), inset 0 0 60px rgba(245, 158, 11, 0.3)";
            }
            else { 
                gpaElement.classList.add('glow-danger');
                msgElement.innerText = "CRITICAL WARNING 💀"; 
                msgElement.style.color = "var(--danger)";
                resultBox.style.borderColor = "var(--danger)";
                resultBox.style.boxShadow = "0 30px 60px rgba(0,0,0,0.9), inset 0 0 100px rgba(255, 0, 85, 0.4)";
            }

            setTimeout(() => gpaElement.classList.remove('reveal-pop'), 1200);
        });

    }, 1200); 
}

function animateValue(obj, start, end, duration, callback) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const easeOutQuad = progress * (2 - progress);
        obj.innerHTML = (easeOutQuad * (end - start) + start).toFixed(2);
        
        if (progress < 1) window.requestAnimationFrame(step);
        else if(callback) callback();
    };
    window.requestAnimationFrame(step);
}
