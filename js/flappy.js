function newElement(tagName, className) {
  try {
    const elem = document.createElement(tagName)
    elem.className = className
    return elem
  } catch (error) {
    console.log(error.message);
  }
}

function Barrier(reversa = false) {
  try {
    this.element = newElement('div', 'barreira')
  
    const edge = newElement('div', 'borda')
    const body = newElement('div', 'corpo')
    this.element.appendChild(reversa ? body : edge)
    this.element.appendChild(reversa ? edge : body)
  
    this.setAltura = height => body.style.height = `${height}px`
    
  } catch (error) {
    console.log(error.message);
  }
}

function pairOfBarriers(height, opening, x) {
  try {
    this.element = newElement('div', 'par-de-barreiras')
  
    this.top = new Barrier(true)
    this.botton = new Barrier(false)
  
    this.element.appendChild(this.top.element)
    this.element.appendChild(this.botton.element)
  
    this.luckyOpening = () => {
      const heightTop = Math.random() * (height - opening)
      const lowerHeight = height - opening - heightTop
      this.top.setAltura(heightTop)
      this.botton.setAltura(lowerHeight)
    }
  
    this.getX = () => parseInt(this.element.style.left.split('px')[0])
    this.setX = x => this.element.style.left = `${x}px`
    this.getWidth = () => this.element.clientWidth
  
    this.luckyOpening()
    this.setX(x)
    
  } catch (error) {
    console.log(error.message);
  }
}

function Barriers(height, width, opening, space, notifyPoints) {
  try {
    this.pairs = [
      new pairOfBarriers(height, opening, width),
      new pairOfBarriers(height, opening, width + space),
      new pairOfBarriers(height, opening, width + space * 2),
      new pairOfBarriers(height, opening, width + space * 3),
    ]
  
    const displacement  = 3
    this.animation = () => {
      this.pairs.forEach(par => {
        par.setX(par.getX() - displacement)
  
        // quando o element sair da área do jogo
        if (par.getX() < -par.getWidth()) {
          par.setX(par.getX() + space * this.pairs.length)
          par.luckyOpening()
        }
  
        const quite = width / 2
        const halfCrossed = par.getX() + displacement >= quite && par.getX() < quite
        if(halfCrossed) notifyPoints()
      })
    }
  } catch (error) {
    console.log(error.message);
  }
}

  function Bird(hightGame) {

    try {
      let fly = false
  
      this.element = newElement('img', 'passaro')
      this.element.src = 'imgs/nave-espacial.png'
  
      this.getY = () => parseInt(this.element.style.bottom.split('px')[0])
      this.setY = y => this.element.style.bottom = `${y}px`
  
      window.onkeydown = e => fly = true
      window.onkeyup = e => fly = false
  
      this.animation = () => {
        const newY = this.getY() + (fly ? 8 : -5)
        const hightMaxGame = hightGame - this.element.clientHeight
  
        if (newY <= 0) {
          this.setY(0)
        } else if (newY >= hightMaxGame) {
          this.setY(hightMaxGame)
        } else {
          this.setY(newY)
        }
      }
      this.setY(hightGame / 2)
      
    } catch (error) {
      console.log(error.message);
    }
}

function Progress() {
  try {
    this.element = newElement('span', 'progresso')
    this.updatePoints = points => {
      this.element.innerHTML = points
    }
    this.updatePoints(0)
    
  } catch (error) {
    console.log(error.message);
  }
}

function areOverlapping(elementA, elementB) {
  try {
    const a = elementA.getBoundingClientRect()
    const b = elementB.getBoundingClientRect()
  
    const horizontal = a.left + a.width >= b.left
      && b.left + b.width >= a.left
  
    const vertical = a.top + a.height >= b.top
      && b.top + b.height >= a.top
  
    return horizontal && vertical
  } catch (error) {
    console.log(error.message);
  }

}

function collided(bird, barriers) {
try {
  let collided = false
  barriers.pairs.forEach(pairOfBarriers => {
    if (!collided) {
      const top = pairOfBarriers.top.element
      const botton = pairOfBarriers.botton.element
      collided = areOverlapping(bird.element, top)
        || areOverlapping(bird.element, botton)
    } 
  })
  return collided 
  
} catch (error) {
  console.log(error.message);
  }
}

function FlappyBird() {
  try {
    let points = 0
    this.points

    const gameArea = document.querySelector('[wm-flappy]')
    const height = gameArea.clientHeight
    const width = gameArea.clientWidth
    
    const progress = new Progress()
    const barriers = new Barriers(height, width, 250, 400, () => progress.updatePoints(++points))
    const bird = new Bird(height)
  
    gameArea.appendChild(progress.element)
    gameArea.appendChild(bird.element)
    barriers.pairs.forEach(par => gameArea.appendChild(par.element))
  
    this.start = () => {
      // loop do jogo
      const temporizador = setInterval(() => {
        barriers.animation()
        bird.animation()
        if (collided(bird, barriers)) {
          clearInterval(temporizador)
        }
      }, 18)
    }
  } catch (error) {
    console.log(error.message);
  }
}


new FlappyBird().start()