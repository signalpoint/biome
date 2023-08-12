class DesignerPlayback {

  constructor() {

  }

  btnOnclickListener(btn) {

    let playback = btn.getAttribute('data-playback')

    switch (playback) {
      case 'pause': this.pause(); break
      case 'play': this.play(); break
    }

  }

  getPauseBtn() { return document.querySelector('#playbackBtns button[data-playback="pause"]') }
  getPlayBtn() { return document.querySelector('#playbackBtns button[data-playback="play"]') }

  pause() {

    cancelAnimationFrame(d._animationFrame)
    d._animationFrame = null

    this.getPauseBtn().classList.add('active')
    this.getPlayBtn().classList.remove('active')

    d.setPlayback('pause')

    game.togglePause()

  }

  play() {

    // make sure we get rid of the other draw calls when animate is running!

//        console.log('starting animation...')

    d._animationFrame = requestAnimationFrame(animate)

    setTimeout(function() {

      console.log('canceling animation...')

      playbackBtnsContainer.querySelector('button[data-playback="pause"]').click()


    }, 60000 * 4)

//        console.log('playing animation...')

    this.getPauseBtn().classList.remove('active')
    this.getPlayBtn().classList.add('active')

    d.setPlayback('play')

    game.togglePause()

  }

}
