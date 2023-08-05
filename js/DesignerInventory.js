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
        `<div class="card bg-dark text-light mb-1 me-1" style="width: 4rem; height: 4rem">
          <div class="card-body">`

      if (slot) {

        let def = player.inventory.getDefinition(i)

        html +=

          `<h4 class="card-title">
            <span class="badge bg-primary float-start me-2">${player.inventory.getSlotQty(i)}</span>
            ${def.label}
          </h4>`

      }

      else {

        html +=

          `&nbsp;`

      }

      html +=

          `</div>
        </div>`

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

`<div class="row mx-1">`

      }

      html+= renderCard(i)

      if (rowDelta == rowSize - 1) {

        html +=

`</div>`

      }

      slots.push(html)

      rowDelta++

      if (rowDelta == rowSize) { rowDelta = 0 }

    }

    playerMode.getPane('inventory').innerHTML =

      slots.join('') + '<hr class="mb-3" />' +
      '<div class="row mx-1">' + quick.join('') + '</div>'

  }

  init() {

  }

  refresh() {
    this.render()
    this.init()
  }

}
