/**
 * Foop effect
 */

game.Foop = me.Sprite.extend({
  /**
   * constructor
   */
  init: function(x, y, lt) {
    if (!this.lifeTime) {
      // call the constructor
      this._super(me.Sprite, 'init', [x, y, {
        image: "foop",
        framewidth: 256,
        frameheight: 256
      }]);
      this.msPerBeat = 666.667; //in ms
      this.addAnimation("foop", [0, 1, 2, 3, 4], this.msPerBeat / 5);
      this.addAnimation("wait", [4]);
    }
    this.lifeTime = lt;
    this.pos.x = x;
    this.pos.y = y;
    this.setOpacity(1.0);
    this.setAnimationFrame(0);
    this.setCurrentAnimation("foop", "wait");
    this.createTime = me.timer.getTime();
  },

  draw: function(renderer) {
    this._super(me.Sprite, 'draw', [renderer]);
  },

  update: function(dt) {
    this._super(me.Sprite, "update", [dt]);
    if (me.timer.getTime() - this.createTime >= this.lifeTime) {
      //me.game.world.removeChild(this);
      me.pool.push(this);
      this.setOpacity(0.0);
    }
    return true;
  }
});