let fileOpenModal = null
let fileSaveModal = null

class DesignerMenu {

  constructor() {

  }

  onclick(e, op) {

    switch (op) {

      case 'file:open':

        this.openModal('fileOpenModal')

        break;

      case 'file:save':

        let name = 'BakedLake'

        // Save map name to storage.
        let maps = d.loadMaps()
        if (!maps.includes(name)) {
          maps.push(name)
          d.saveMaps(maps)
        }

        // Save map to storage
        d.saveCurrentMap()

        console.log(name, dStorage.exportMapJson())

        // Save player
        player.save()

        break;

      case 'view:grid':

        let span = getAnchorFromEvent(e).querySelector('span')
        d.setGrid(!d.getGrid())
        span.innerHTML = d.getGrid() ? 'Hide Grid' : 'Show Grid'
        refresh()

        break;

    }

  }

  openModal(id) {

    let body = ''

    switch (id) {

      // FILE / OPEN
      case 'fileOpenModal':

        let maps = d.loadMaps()
        if (maps.length) {
          let items = []
          for (var i = 0; i < maps.length; i++) {
            items.push(
            '<li class="list-group-item">' +
              '<a class="btn btn-link">' + maps[i] + '</a>' +
            '</li>'
            )
          }
          body = '<ul id="fileOpenListGroup" class="list-group">' + items.join('') + '</ul>'
        }
        else {
          body = '<div class="alert alert-info">No maps created, yet!</div>'
        }

        break;

    }


    document.querySelector('#' + id + ' .modal-body').innerHTML = body
    window[id] = new bootstrap.Modal('#' + id)
    window[id].show()

    // after modal opens...

    setTimeout(function() {

      switch (id) {

        // FILE / OPEN
        case 'fileOpenModal':

          // item click listeners
          let links = document.querySelectorAll('#fileOpenListGroup li a')
          for (var i = 0; i < links.length; i++) {
            links[i].addEventListener('click', function() {

              let mapName = this.innerHTML

              // import map
              dStorage.importMap(mapName)

              // hide modal
              window[id].hide()

              // remember as last map opened
              dStorage.save('LastMapOpened', mapName)

            })
          }

          break;

      }

    })

  }

}
