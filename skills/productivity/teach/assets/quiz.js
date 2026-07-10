/* quiz.js — reusable retrieval-practice widget for the macOS CLI course.
   Linked by lessons: <script src="../assets/quiz.js" defer></script>
   Markup contract:
     <div class="quiz">
       <p class="q">Question?</p>
       <div class="options">
         <button class="opt" data-correct>right answer</button>
         <button class="opt">distractor</button>
       </div>
       <div class="explain" hidden>Why the answer is right...</div>
     </div>
   Click => immediate feedback, locks the question, reveals the explanation.
   A running score line (.quizscore) anywhere on the page updates automatically. */
(function () {
  "use strict";
  function ready(fn){ document.readyState!=="loading" ? fn() : document.addEventListener("DOMContentLoaded", fn); }
  // Fisher-Yates shuffle — randomizes option order so the correct answer never sits in a
  // predictable slot; re-randomizes on every page load so positions can't be memorized.
  function shuffle(a){ for (var i=a.length-1;i>0;i--){ var j=Math.floor(Math.random()*(i+1)); var t=a[i]; a[i]=a[j]; a[j]=t; } return a; }
  ready(function () {
    var quizzes = Array.prototype.slice.call(document.querySelectorAll(".quiz"));
    var total = quizzes.length, answered = 0, correct = 0;
    var scoreEls = document.querySelectorAll(".quizscore");

    function updateScore() {
      var txt = "Recall: " + correct + " / " + answered + " correct"
              + (answered < total ? "  ·  " + (total - answered) + " to go" : "  ·  done ✓");
      for (var i = 0; i < scoreEls.length; i++) scoreEls[i].textContent = txt;
    }
    if (scoreEls.length) updateScore();

    quizzes.forEach(function (quiz, qi) {
      var head = document.createElement("div");
      head.className = "qhead";
      head.textContent = "Recall · Q" + (qi + 1);
      quiz.insertBefore(head, quiz.firstChild);

      var box = quiz.querySelector(".options");
      if (box) shuffle(Array.prototype.slice.call(box.querySelectorAll("button.opt"))).forEach(function (b) { box.appendChild(b); });

      var opts = Array.prototype.slice.call(quiz.querySelectorAll("button.opt"));
      var explain = quiz.querySelector(".explain");
      var done = false;

      opts.forEach(function (btn) {
        btn.addEventListener("click", function () {
          if (done) return;
          done = true;
          var isRight = btn.hasAttribute("data-correct");
          opts.forEach(function (b) {
            b.disabled = true;
            if (b.hasAttribute("data-correct")) b.classList.add("correct");
          });
          if (!isRight) btn.classList.add("wrong");

          var fb = document.createElement("div");
          fb.className = "feedback " + (isRight ? "ok" : "bad");
          fb.textContent = isRight ? "✓ Correct." : "✗ Not quite — the right answer is highlighted.";
          quiz.insertBefore(fb, explain || null);
          if (explain) explain.hidden = false;

          answered++; if (isRight) correct++;
          if (scoreEls.length) updateScore();
        });
      });
    });
  });
})();
