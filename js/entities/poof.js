/**
 * Poof effect
 */

game.Poof = me.Sprite.extend({
  /**
   * constructor
   */
  init: function(x, y) {
    // call the constructor
    if (!this.lifeTime) {
      this._super(me.Sprite, 'init', [x, y, {
        image: "poof",
        framewidth: 384,
        frameheight: 384
      }]);
      this.lifeTime = 666.667; //in ms
      this.addAnimation("poof", [0, 1, 2, 3, 4, 5, 6], this.lifeTime / 6);
    }
    this.pos.x = x;
    this.pos.y = y;
    this.setAnimationFrame(0);
    this.setCurrentAnimation("poof");
    this.createTime = me.timer.getTime();
    //me.game.world.addChild(this, 10);
    this.setOpacity(1.0);
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