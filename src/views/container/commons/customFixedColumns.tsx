// width của checkbox (nếu có) trong TableBootstrapHook mặc định là 35
// left = width các cột trước nó cộng lại
// mặc định cho minWidth = maxWidth

export const CustomFixedColumns: any = (minWidth, maxWidth, left, textAlign) => {
  return window.innerWidth > 1200
    ? {
        position: 'sticky',
        textAlign: textAlign,
        left: left,
        top: 0,
        zIndex: 1,
        minWidth: minWidth,
        maxWidth: maxWidth,
        backgroundColor: '#f4f8f9'
      }
    : {
        textAlign: textAlign,
        minWidth: minWidth
      };
};
