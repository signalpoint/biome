class BuildersWorkshop extends Building {

  constructor({
    delta,
    x,
    y,
    width = 64,
    height = 64,
    primaryColor = '#ddca7d',
    secondaryColor = '#b88b4a',
    icon = 'fas fa-toolbox',
    iconUnicode = '\u{f552}'
  }) {

    super({
      delta,
      type: 'BuildersWorkshop',
      x,
      y,
      width,
      height,
      primaryColor,
      secondaryColor,
      icon,
      iconUnicode,
      maxWorkers: 2
    })

    this._orders = []

  }

  // abstracts / interfaces

  update() {

  }

  getPaneContent() {

    let html = ''

    // ORDERS
    if (this.hasOrders()) {
      let orders = this.getOrders()
      let li = []
      for (let i = 0; i < orders.length; i++) {
        let order = orders[i]
        li.push(
          `<li class="list-group-item">
            ${order.getData()}
            <span class="badge bg-secondary float-end">${order.getStatusLabel()}</span>
          </li>`
        )
      }
      html +=
        `<div class="fs-5 fst-italic">Orders</div>
        <ul class="list-group mb-3">${li.join('')}</ul>`
    }

    if (this.hasWorker()) {

      // ITEMS
      let items = []
      let types = d.getItemTypes()
      for (let i = 0; i < types.length; i++) {

        let type = types[i]
        let item = dItems.getType(type)
        let requirements = dItems.getRequirements(type)
        let li = []
        for (let requirement in requirements) {
          let needed = requirements[requirement]
          li.push(
            `<li class="list-group-item">
              ${requirement}
              <span class="badge bg-secondary float-end">${needed}</span>
            </li>`
          )
        }
        let card =
          `<div class="card" style="width: 18rem;">
            <div class="card-body">
              <h5 class="card-title">${item.label}</h5>
              <p class="card-text mb-2">${item.description}</p>
              <div class="fs-6 fst-italic">Needs</div>
              <ul class="list-group mb-3">${li.join('')}</ul>
              <button class="btn btn-primary builders-workshop-order-btn" title="Order ${item.label}" data-type="${type}">
                Order
                <i class="fas fa-share float-end ms-2"></i>
              </button>
            </div>
          </div>`

        items.push(card)

      }
      html += items.join()

    }

    return html

  }

  attachEventListeners() {

    let self = this

    // order buttons
    let orderBtns = this.getWidget().getElement().querySelectorAll('button.builders-workshop-order-btn')
    for (let i = 0; i < orderBtns.length; i++) {
      orderBtns[i].addEventListener('click', function(e) {

        let btn = getBtnFromEvent(e)
        let itemType = btn.getAttribute('data-type')

        self.addOrder(new Order({
          type: 'item',
          data: itemType
        }))

        self.refreshWidget()

      })
    }

  }

  handleVillagerArrival(villager) {

    // TODO I think this handler is being fired 2x for each arrival

    // check for any new orders...
    let newOrders = this.getOrdersByStatus(ORDER_STATUS_NEW)
    if (newOrders) {

      let order = newOrders[0]

      console.log('new order available', order)

      // BUILDING
      if (order.getType() == 'building') {

      }

      // ITEM
      else if (order.getType() == 'item') {

        // TODO rename "requirements" to "parts" everywhere!!!!

        let types = []

        // Item Parts
        let parts = d.getItemTypeRequirements(order.getData())
        for (let type in parts) {
          if (!parts.hasOwnProperty(type)) { continue }

          let buildingType = dBlocks.getStorageBuildingType(type)

          // make sure a building that stores the item exists
          if (!dBlocks.storageBuildingExists(buildingType)) {
            console.log(`no ${buildingType} exists to pickup ${type} from`)
            continue
          }

          types.push(type)

          let storageBuilding = dBlocks.getStorageBuilding(type)
          console.log('storage building', type, storageBuilding)

          villager.addActions([

            // go to the building that has the entity
            new ActionGoToBuilding({
              delta: storageBuilding.delta
            }),

            // take entity from building
            new ActionTakeEntityFromBuilding({
              delta: villager.getEmployer().delta,
              type
            })

          ])

        }

        // after gathering parts...

        villager.addActions([

          // come back to this building
          new ActionGoToBuilding({
            delta: villager.getEmployer().delta
          }),

          // drop entity at this building
          new ActionDropEntityAtBuilding({
            delta: villager.getEmployer().delta,
            type: 'block',
            data: types
          }),

          // go to the campground
          new ActionGoToBuilding({
            delta: player.getCampground().delta
          })

        ])


        villager.addAction()

      }

      order.setStatus(ORDER_STATUS_PROCESSING)

      this.refreshWidget()

    }
    else {

      console.log('BuildersWorkshop', 'no new orders')

      // go to the campground
      villager.addAction(new ActionGoToBuilding({
        delta: player.getCampground().delta
      }))

    }

  }

  // METHODS

  // ORDERS

  getOrders() { return this._orders }
  getOrder(i) { return this._orders[i] }
  getOrderCount() { return this._orders.length }
  getOrdersByStatus(status) {
    let orders = []
    for (let i = 0; i < this.getOrderCount(); i++) {
      let order = this.getOrder(i)
      if (order.getStatus() == status) {
        orders.push(order)
      }
    }
    return orders.length ? orders : null
  }
  hasOrders() { return !!this.getOrderCount() }
  addOrder(order) { this._orders.push(order) }

}
