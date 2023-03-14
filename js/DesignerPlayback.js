class DesignerPlayback {

  constructor() {

  }

  btnOnclickListener(btn) {

    let playback = btn.getAttribute('data-playback')

    switch (playback) {

      case 'pause':

//        console.log('pausing animation...')

        cancelAnimationFrame(d._animationFrame)
        d._animationFrame = null

        break;

      case 'play':

        // make sure we get rid of the other draw calls when animate is running!

//        console.log('starting animation...')

        d._animationFrame = requestAnimationFrame(animate)

        setTimeout(function() {

          console.log('canceling animation...')

          playbackBtnsContainer.querySelector('button[data-playback="pause"]').click()


        }, 60000)

//        console.log('playing animation...')

        break;

    }

    // swap active class on buttons
    playbackBtnsContainer.querySelector('button.active').classList.remove('active')
    btn.classList.add('active')

    // udpate the playback
    d.setPlayback(playback)

  }

}
