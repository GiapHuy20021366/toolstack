export enum EStateSyncOption {
  /**
   * Disable data sync
   */
  NONE = 0,
  /**
   * Allow state sync from top to bottom
   */
  TOP_DOWN = 1,
  /**
   * Allow state sync from bottom to top
   */
  BOTTOM_UP = 2,
  /**
   * Allow state sync on both direction
   */
  BI_DIRECTION = 3,
}
