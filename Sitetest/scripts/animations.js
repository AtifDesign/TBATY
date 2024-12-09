$(document).ready(function() {
  // First load Matter.js from CDN if not already loaded
  if (typeof Matter === 'undefined') {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/matter-js/0.19.0/matter.min.js';
    script.onload = initPhysics;
    document.head.appendChild(script);
  } else {
    initPhysics();
  }

  function initPhysics() {
    const Engine = Matter.Engine,
          World = Matter.World,
          Bodies = Matter.Bodies,
          Body = Matter.Body,
          Mouse = Matter.Mouse,
          MouseConstraint = Matter.MouseConstraint;

    const engine = Engine.create({
      gravity: { x: 0, y: 0.05 }
    });

    // Create mouse interaction
    const mouse = Mouse.create(document.body);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: false }
      }
    });

    World.add(engine.world, mouseConstraint);
    Engine.run(engine);

    const symbols = [
      { symbol: '<i class="fa-solid fa-graduation-cap"></i>', class: 'graduation' },
      { symbol: '<i class="fa-solid fa-book-open"></i>', class: 'book' },
      { symbol: '<i class="fa-solid fa-pencil"></i>', class: 'pencil' },
      { symbol: '<i class="fa-solid fa-award"></i>', class: 'award' },
      { symbol: '<i class="fa-solid fa-user-graduate"></i>', class: 'graduate' },
      { symbol: '<i class="fa-solid fa-laptop-code"></i>', class: 'laptop' },
      { symbol: '<i class="fa-solid fa-certificate"></i>', class: 'certificate' },
      { symbol: '<i class="fa-solid fa-lightbulb"></i>', class: 'lightbulb' },
      { symbol: '<i class="fa-solid fa-brain"></i>', class: 'brain' },
      { symbol: '<i class="fa-solid fa-book"></i>', class: 'book-closed' },
      { symbol: '<i class="fa-solid fa-chalkboard-user"></i>', class: 'teaching' },
      { symbol: '<i class="fa-solid fa-scroll"></i>', class: 'scroll' }
    ];

    let activeSymbols = 0;

    function removeOldestSymbols() {
      const $symbols = $('.floating-symbol');
      while ($symbols.length > 50) {
        const $oldest = $symbols.first();
        const body = $oldest.data('body');
        if (body) {
          World.remove(engine.world, body);
          body.isRemoved = true;
        }
        $oldest.remove();
        activeSymbols--;
        $symbols.splice(0, 1);
      }
    }

    function createFallingSymbol() {
      if (activeSymbols >= 50) {
        removeOldestSymbols();
        return;
      }

      const config = symbols[Math.floor(Math.random() * symbols.length)];
      const size = 1 + Math.random() * 2;
      const spinDuration = 5 + Math.random() * 10;
      const spinDirection = Math.random() > 0.5 ? 'normal' : 'reverse';
      const pageWidth = $(document).width();
      const startX = Math.random() * pageWidth;

      const $symbol = $('<div>', {
        class: `floating-symbol ${config.class}`,
        html: config.symbol,
        css: {
          position: 'absolute',
          left: startX,
          top: -50,
          fontSize: `${size}rem`,
          opacity: 0.7,
          animation: `spin ${spinDuration}s linear infinite ${spinDirection}`,
          cursor: 'grab'
        }
      });

      $('#floating-symbols').append($symbol);
      activeSymbols++;

      const body = Bodies.circle(
        startX,
        -50,
        size * 8,
        {
          friction: 0.001,
          restitution: 0.8,
          density: 0.001,
          frictionAir: 0.02
        }
      );

      $symbol.data('body', body);

      const updatePosition = () => {
        if (!body.isRemoved) {
          const scrollY = window.pageYOffset;
          $symbol.css({
            left: body.position.x - (size * 8),
            top: body.position.y - scrollY - (size * 8),
            transform: `rotate(${body.angle}rad)`
          });

          if (body.position.y > $(document).height() + 100) {
            World.remove(engine.world, body);
            $symbol.remove();
            body.isRemoved = true;
            activeSymbols--;
            return;
          }

          requestAnimationFrame(updatePosition);
        }
      };

      World.add(engine.world, body);
      requestAnimationFrame(updatePosition);

      // Add fade out timeout
      setTimeout(() => {
        if (!body.isRemoved) {
          $symbol.fadeOut(1000, () => {
            World.remove(engine.world, body);
            $symbol.remove();
            body.isRemoved = true;
            activeSymbols--;
          });
        }
      }, 30000);
    }

    // Store interval ID for cleanup
    let symbolInterval = setInterval(createFallingSymbol, 2000);

    // Update the click handler
    $(document).on('click', function(e) {
      const clickedElement = $(e.target);
      
      // Only trigger if clicking within logo-container
      const isInLogoContainer = clickedElement.closest('.logo-container').length > 0;

      if (isInLogoContainer && !mouseConstraint.body) {
        const burstCount = 4 + Math.floor(Math.random() * 3); // 4-6 symbols
        const burstForce = 3;

        if (activeSymbols + burstCount > 50) {
          removeOldestSymbols();
        }

        for (let i = 0; i < burstCount; i++) {
          const config = symbols[Math.floor(Math.random() * symbols.length)];
          const size = 1 + Math.random() * 2;
          const angle = (i / burstCount) * 2 * Math.PI;
          
          const $symbol = $('<div>', {
            class: `floating-symbol ${config.class}`,
            html: config.symbol,
            css: {
              fontSize: `${size}rem`,
              position: 'absolute',
              opacity: 0.7,
              cursor: 'grab'
            }
          });

          $('#floating-symbols').append($symbol);
          activeSymbols++;

          const body = Bodies.circle(
            e.pageX,
            e.pageY,
            size * 8,
            {
              friction: 0.001,
              restitution: 0.8,
              density: 0.001,
              frictionAir: 0.02
            }
          );

          $symbol.data('body', body);

          const forceMagnitude = burstForce * (Math.random() + 0.5);
          Body.setVelocity(body, {
            x: Math.cos(angle) * forceMagnitude,
            y: Math.sin(angle) * forceMagnitude
          });

          const updatePosition = () => {
            if (!body.isRemoved) {
              const scrollY = window.pageYOffset;
              $symbol.css({
                left: body.position.x - (size * 8),
                top: body.position.y - scrollY - (size * 8),
                transform: `rotate(${body.angle}rad)`
              });

              if (body.position.y > $(document).height() + 100) {
                World.remove(engine.world, body);
                $symbol.remove();
                body.isRemoved = true;
                activeSymbols--;
                return;
              }

              requestAnimationFrame(updatePosition);
            }
          };

          World.add(engine.world, body);
          requestAnimationFrame(updatePosition);

          // Add fade out timeout for burst symbols
          setTimeout(() => {
            if (!body.isRemoved) {
              $symbol.fadeOut(1000, () => {
                World.remove(engine.world, body);
                $symbol.remove();
                body.isRemoved = true;
                activeSymbols--;
              });
            }
          }, 30000);
        }
      }
    });

    // Handle scroll
    $(window).on('scroll', function() {
      const scrollY = window.pageYOffset;
      $('.floating-symbol').each(function() {
        const $symbol = $(this);
        const body = $symbol.data('body');
        if (body && !body.isRemoved) {
          $symbol.css('top', body.position.y - scrollY - (parseFloat($symbol.css('font-size')) * 8));
        }
      });
    });
  }
});