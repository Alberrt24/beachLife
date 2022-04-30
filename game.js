kaboom({
    global: true,
    fullscreen: true,
    scale: 2,
    debug: true,
    clearColor: [0,0,0,1],
})

// Speed testing (⇀‸↼‶)
const MOVE_SPEED = 120
const JUMP_FORCE = 360
const BIG_JUMP_FORCE = 550
let CURRENT_JUMP_FORCE = JUMP_FORCE
const FALL_DEATH = 400
const ENEMY_SPEED = 30
const SECOND_ENEMY_SPEED = 15
let current_time = "dayb"

// Game part (─‿‿─)♡

let isJumping = true

loadRoot('https://i.imgur.com/');
loadSprite('lata', 'McTyVrK.png')
loadSprite('evil', 'uDJIaPt.png')
loadSprite('LC1', 'VLBFtYU.png')
loadSprite('CC2', 'uDdZpxd.png')
loadSprite('RC3', 'TujCuqD.png')
loadSprite('LH1', 'M4AeDWZ.png')
loadSprite('CH2', 'SUpqMfN.png')
loadSprite('CH3', 'W36gclw.png')
loadSprite('bg', 'H52pCg7.jpg')
loadSprite('trashcan', '4Y2skLe.png')
loadSprite('cigar', 'B6wKZuR.png')
loadSprite('juice', 'CwMJMET.png')
loadSprite('ball', 'WK4EQpv.png')
loadSprite('dayb', 'BlYR0cI.png')
loadSprite('noonb', 'OG1y8EA.png]')
loadSprite('nightb', 'lr7emCG.png')
loadSprite('girl', 'Kq7Tnu6.png', {
    sliceX: 13,
    sliceY: 1,
    anims: {
        walk: {
            from: 0,
            to: 7,
        },
        jump: {
            from: 8,
            to: 13,
        },
    }, 
}); 

scene("game", ({ level, score, dayTime }) => {
    layers(['obj', 'ui'], 'obj')

    const map = [
        [
        '                                                                                     ',
        '                                                                                     ',
        '                                                                                     ',
        '                                                                                     ',
        '                                                                                     ',
        '        $                     $                         $                            ',
        '       ¡@!                   ¡@!                       ¡@!                           ',
        '                                                                                  ?  ',
        '           ^  $         $       &         $          +     $      /              *   ',
        '===============%    -==============%   -======%   -================%     -===========%',
      ],  
      [
        '                                                                                      ',
        '                                                                                      ',
        '                                                                                      ',
        '                                                                                      ',
        '                                                                                      ',
        '        $                     #                         $                             ',
        '       ¡@!                   ¡@!                       ¡@!                            ',
        '                                                                                 ¦    ',
        '           ^  #         $       &         #  #        +     $ #    /                 *',
        '===============%    -==============%   -======%   -================%     -===========%',
      ]
    ]

    const levelCfg = {
        width: 20,
        height: 20,
        '=': [sprite('CC2'), solid(), scale(1.3)],
        '^': [sprite('evil'), body(), scale(0.7), 'dangerous'],
        '&': [sprite('evil'), body(), scale(0.7), 'dangerous'],
        '*': [sprite('evil'), body(), scale(0.7), 'crabs_dangerous'],
        '+': [sprite('evil'), body(), scale(0.7), 'crabs_dangerous'],
        '/': [sprite('evil'), body(), scale(0.7), 'dangerous'],
        '$': [sprite('lata'), scale(0.9), 'lata'],
        '-': [sprite('LC1'), solid(), scale(1.3)],
        '%': [sprite('RC3'), solid(), scale(1.3)],
        '¡': [sprite('LH1'), solid(), scale(1.3)],
        '@': [sprite('CH2'), solid(), scale(1.3)],
        '!': [sprite('CH3'), solid(), scale(1.3)],
        '?': [sprite('trashcan'), solid(), scale(1.3), 'trashcan'],
        '#': [sprite('cigar'), solid(), scale(0.7), 'lata'],
        '¦': [sprite('ball'), solid(), scale(1.3), 'ball'],
    }

    add([
        sprite(dayTime),
        scale(width()/500, height()/500),
        {width: width(), height: height()},
        layer(dayTime)
    ]);

    const gameLevel = addLevel(map[level], levelCfg)

    const pointsLabel = add([
        text(score),
        pos(30, 6),
        layer('ui'),
        {
            value: score,
        }
    ])

    const player = add([
        sprite('girl'), 
        solid(),
        scale(1.5),
        pos(30, 0),
        body(),
        origin('bot')
        
      ])
     
      player.collides('lata', (l) => {
          destroy(l)
          pointsLabel.value++
          pointsLabel.text = pointsLabel.value
      }),  

      action('dangerous', (d) => {
          d.move(-ENEMY_SPEED, 0)
      })

      action('crabs_dangerous', (d) => {
        d.move(-SECOND_ENEMY_SPEED, 0)
    })

      player.collides('dangerous', (d) =>{
          go('lose', {score: pointsLabel.value})
      })

      player.action(()=>{
          camPos(player.pos)
          if (player.pos.y >= FALL_DEATH){
              go('lose', {score: pointsLabel.value})
          }
      })

      player.collides('trashcan', () => {
        keyPress('down', () => {
           current_time = "nightb"
          go('game', {
            level: (level + 1) % map.length,
            score: pointsLabel.value,
            dayTime: current_time,
          })
        })
      })


      player.collides('ball', () => {
        keyPress('down', () => {
          go('congrats', {score: pointsLabel.value})
        })
      })

      keyPress('left', () => {
        player.move(-MOVE_SPEED, 0)
        player.play("walk")
      })

      keyPress('right', () => {
        player.move(-MOVE_SPEED, 0)
        player.play("walk")
      })

      keyDown('left', () => {
        player.move(-MOVE_SPEED, 0)
      })
    
      keyDown('right', () => {
        player.move(MOVE_SPEED, 0)
      })

      keyPress("space", () => {
        if (player.grounded()){
            player.jump(JUMP_FORCE)
            }
    })
})

scene('lose', ({ score }) =>{
    add([
        text(score, 32), 
         pos(460, 130)
    ]);

    add([
        sprite("noonb"),
        {width: width(), height: height()},
    ]);

    add([
        text("GAME OVER"),
        pos(380, 80),
        scale(3),
    ]);

    add([
        rect(160, 20),
        pos(400, 180),
        "button",
        {
            clickAction: () => go('game', ({level:0, score: 0, dayTime:current_time})),
        },
    ]);

    add([
        text("Play again"),
        pos(410, 185),
        color(0, 0, 0)
    ]);

    action("button", b => {

        if (b.isHovered()) {
            b.use(color(0.7, 0.7, 0.7));
        } else {
            b.use(color(1, 1, 1));
        }

        if (b.isClicked()) {
            b.clickAction();
        }

    });
})

scene('congrats', ({ score }) =>{
    add([
        text(score, 32), 
         pos(460, 130)
    ]);

    add([
        sprite("noonb"),
        {width: width(), height: height()},
    ]);

    add([
        text("FELICITACIONES"),
        pos(310, 80),
        scale(3),
    ]);

    add([
        rect(160, 20),
        pos(400, 180),
        "button",
        {
            clickAction: () => go('game', ({level:0, score: 0, dayTime:current_time})),
        },
    ]);

    add([
        text("Play again"),
        pos(410, 185),
        color(0, 0, 0)
    ]);
    action("button", b => {

        if (b.isHovered()) {
            b.use(color(0.7, 0.7, 0.7));
        } else {
            b.use(color(1, 1, 1));
        }

        if (b.isClicked()) {
            b.clickAction();
        }

    });
})

start("game", ({level:0, score: 0, dayTime:current_time}))
