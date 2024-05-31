import MkEntity from './MkEntity.js';

export default class MkPlace extends MkEntity {

  // TODO
  // - a place will have layers

  constructor({
    id = null,
    bundle = null,
  }) {

    super({

      type: 'place',

      id,
      bundle

    })

  }

}
