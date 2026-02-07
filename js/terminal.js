(function () {
  'use strict';

  var COMMANDS = ['help', 'about', 'experience', 'education', 'projects', 'achievements', 'contact', 'top', 'clear'];

  var SECTIONS = {
    about: 'section-about',
    experience: 'section-experience',
    education: 'section-education',
    projects: 'section-projects',
    achievements: 'section-achievements',
    contact: 'section-contact'
  };

  var input = document.getElementById('terminal-input');
  var body = document.getElementById('terminal-body');
  var helpOverlay = document.getElementById('help-overlay');
  var history = [];
  var historyIndex = -1;

  // === Command Execution ===
  function executeCommand(cmd) {
    cmd = cmd.trim().toLowerCase();
    if (!cmd) return;

    history.push(cmd);
    historyIndex = history.length;

    if (cmd === 'help') {
      toggleHelp();
    } else if (cmd === 'top') {
      body.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (cmd === 'clear') {
      input.value = '';
    } else if (SECTIONS[cmd]) {
      closeHelp();
      scrollToSection(SECTIONS[cmd]);
    } else {
      showFlash("Command not found: '" + cmd + "'. Type 'help' for available commands.");
    }

    input.value = '';
  }

  // === Scroll to Section ===
  function scrollToSection(id) {
    var el = document.getElementById(id);
    if (!el) return;
    var bodyRect = body.getBoundingClientRect();
    var elRect = el.getBoundingClientRect();
    var offset = elRect.top - bodyRect.top + body.scrollTop - 16;
    body.scrollTo({ top: offset, behavior: 'smooth' });
  }

  // === Help Overlay ===
  function toggleHelp() {
    helpOverlay.classList.toggle('active');
  }

  function closeHelp() {
    helpOverlay.classList.remove('active');
  }

  // === Flash Message ===
  function showFlash(msg) {
    var existing = document.querySelector('.flash-message');
    if (existing) existing.remove();

    var el = document.createElement('div');
    el.className = 'flash-message';
    el.textContent = msg;
    document.body.appendChild(el);

    setTimeout(function () {
      el.classList.add('fade-out');
      setTimeout(function () { el.remove(); }, 300);
    }, 3000);
  }

  // === Tab Completion ===
  function tabComplete() {
    var val = input.value.trim().toLowerCase();
    if (!val) return;
    var matches = COMMANDS.filter(function (c) { return c.indexOf(val) === 0; });
    if (matches.length === 1) {
      input.value = matches[0];
    }
  }

  // === Input Events ===
  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      executeCommand(input.value);
    } else if (e.key === 'Tab') {
      e.preventDefault();
      tabComplete();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex > 0) {
        historyIndex--;
        input.value = history[historyIndex];
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex < history.length - 1) {
        historyIndex++;
        input.value = history[historyIndex];
      } else {
        historyIndex = history.length;
        input.value = '';
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      closeHelp();
      input.value = '';
      input.blur();
    }
  });

  // === Global Key Shortcuts ===
  document.addEventListener('keydown', function (e) {
    if (e.key === '/' && document.activeElement !== input) {
      e.preventDefault();
      input.focus();
    }
    if (e.key === 'Escape') {
      closeHelp();
    }
  });

  // === Click to Focus ===
  body.addEventListener('click', function () {
    var sel = window.getSelection();
    if (!sel || sel.toString().length === 0) {
      input.focus();
    }
  });

  // === Help Overlay Click Outside ===
  helpOverlay.addEventListener('click', function (e) {
    if (e.target === helpOverlay) {
      closeHelp();
    }
  });

  // === Typing Animation (Desktop Only) ===
  function runTypingAnimation() {
    if (window.innerWidth < 960) return;

    var elements = document.querySelectorAll('[data-typing]');
    var delay = 0;

    elements.forEach(function (el) {
      var text = el.textContent;
      el.textContent = '';
      el.classList.add('revealed');

      var cursor = document.createElement('span');
      cursor.className = 'typing-cursor';
      cursor.textContent = '';
      el.parentElement.appendChild(cursor);

      var i = 0;
      var speed = el.dataset.typing === 'name' ? 60 : 40;

      setTimeout(function () {
        var interval = setInterval(function () {
          if (i < text.length) {
            el.textContent += text.charAt(i);
            i++;
          } else {
            clearInterval(interval);
            setTimeout(function () {
              cursor.remove();
            }, 2000);
          }
        }, speed);
      }, delay);

      delay += text.length * speed + 300;
    });
  }

  // Run typing animation on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runTypingAnimation);
  } else {
    runTypingAnimation();
  }
})();
