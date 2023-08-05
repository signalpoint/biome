class DesignerInventory {

  constructor() {

  }

  // ...

  render() {

    let size = player.inventory.getSize()
    let quickSize = BELT_SIZE

    let renderCard = function(i) {


      let slot = player.inventory.get(i)

      let html =

        `<li class="nav-item px-1">`

      if (slot) {

        let def = player.inventory.getDefinition(i)

        html +=

          `<a class="nav-link px-2 text-secondary">
            <span class="badge bg-primary float-start me-2">${player.inventory.getSlotQty(i)}</span>
            ${def.label}
          </a>`

      }

      else {

        html +=

          `<i class="far fa-square fa-4x text-secondary"></i>`

      }

      html +=

        `</li>`

      return html

    }

    // QUICK STORAGE

    let quick = []
    for (let i = 0; i < quickSize; i++) {
      quick.push(renderCard(i))
    }

    // STORAGE

    let slots = []
    let rowSize = 10
    let rowDelta = 0
    for (let i = quickSize; i < size; i++) {

      let html = ''

      if (rowDelta == 0) {

        html +=

`<div class="row"><div class="col-12 text-center"><ul class="nav justify-content-center">`

      }

      html+= renderCard(i)

      if (rowDelta == rowSize - 1) {

        html +=

`</ul></div></div>`

      }

      slots.push(html)

      rowDelta++

      if (rowDelta == rowSize) { rowDelta = 0 }

    }

    let el = document.querySelector('#playerInventoryElement')
    if (el) {
      el.innerHTML =
        slots.join('') +
        '<hr class="mb-3" />' +
        '<div class="row"><div class="col-12 text-center"><ul class="nav justify-content-center">' + quick.join('') + '</ul></div></div>'
    }

  }

  init() {

  }

  refresh() {
    this.render()
    this.init()
  }

}
