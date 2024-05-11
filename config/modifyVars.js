// for colors
const colors = require('../src/color');
// for colors

module.exports = {
  // https://github.com/ant-design/ant-design/blob/master/components/style/themes/default.less
  'primary-color': colors['primary-color'], //primary color
  'link-color': '#1890ff', // link color
  'success-color': '#52c41a', // success state color
  'warning-color': '#faad14', // warning state color
  'error-color': '#f5222d', // error state color
  'font-size-base': '12px', // major text font size
  'font-size-lg': '12px',
  'font-size-sm': '11px',
  // 'heading-color': 'rgba(0, 0, 0, 0.85)', // heading text color
  // 'text-color': 'rgba(0, 0, 0, 0.65)', // major text color
  // 'text-color-secondary': 'rgba(0, 0, 0, 0.45)', // secondary text color
  // 'disabled-color': 'rgba(0, 0, 0, 0.25)', // disable state color
  // 'border-color-base': '#d9d9d9', // major border color
  'border-radius-base': '4px', // major border radius
  'box-shadow-base': '0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 9px 28px 8px rgba(0, 0, 0, 0.05)', // major shadow for layers

  // advanced:
  // 'btn-primary-bg': 'linear-gradient(to right, #f3a44d, #d77f93 50%, #2a3ea4)'

  // 1. input custom
  'input-bg': colors['bg-color'],
  'input-border-color': colors['bg-color'],
  'input-number-handler-bg': colors['bg-color'],
  'input-number-handler-border-color': colors['bg-color'],
  'select-border-color': colors['bg-color'],
  'select-background': colors['bg-color'],
  'picker-bg': colors['bg-color'],
  'picker-border-color': colors['bg-color'],
  // end - 1. input custom

  // 2. checkbox
  'checkbox-size': '18px',
  'checkbox-check-bg': colors['bg-color'],
  'checkbox-border-width': '0px',
  // end - 2. checkbox

  // 3. cascader
  'cascader-bg': colors['bg-color'],
  'cascader-menu-bg': colors['bg-color'],
  'cascader-item-selected-bg': colors['bg-color'],
  // end - 3. cascader

  // 4. disabled state
  'disabled-color': '#000',
  'disabled-bg': '#f4f4f4',
  // end - 4. disabled state

  // 5. Form
  'form-item-label-font-size': '12px'
  // end - 5. Form
};
