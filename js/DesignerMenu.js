class DesignerMenu {

  constructor() {

  }

  onclick(e, op) {

    switch (op) {

      case 'file:save':
        console.log('SAVE!')
        const myModalAlternative = new bootstrap.Modal('#fileSaveModal')
        myModalAlternative.show()
        break;

    }

  }

}
