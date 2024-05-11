import COLOR from '~/color';
import LoadingOverlay from 'react-loading-overlay-ts';
import styled from 'styled-components';

type LoadingOverlayStyledProps = {
  length: number;
  styles?: any;
  active?: boolean;
  fadeSpeed?: number;
  spinner?: any;
};

const LoadingOverlayStyled = styled(LoadingOverlay)<LoadingOverlayStyledProps>`
  ${(props) =>
    new Array(props.length > 20 ? 20 : props.length).fill(1).map((animation, i) => {
      return ` .ht_cell_event${i} {
      -webkit-animation-name: ht_cell_event;
      animation-name: ht_cell_event;
      -webkit-animation-duration: ${(i + 8) * 0.025}s;
      animation-duration: ${(i + 8) * 0.025}s;
    }`;
    })}

  z-index: 1;

  .ht_cell_event {
    transition: all cubic-bezier(0.075, 0.82, 0.165, 1);
    -webkit-transition: all cubic-bezier(0.075, 0.82, 0.165, 1);
    -moz-transition: all cubic-bezier(0.075, 0.82, 0.165, 1);
    -ms-transition: all cubic-bezier(0.075, 0.82, 0.165, 1);
    -o-transition: all cubic-bezier(0.075, 0.82, 0.165, 1);
    :hover {
      // background: ${COLOR['primary-color']}33;
      box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075) !important;
    }
  }

  @-webkit-keyframes ht_cell_event {
    0% {
      opacity: 0;
      -webkit-transform: translate3d(100%, 0, 0);
      transform: translate3d(100%, 0, 0);
    }
    100% {
      opacity: 1;
      -webkit-transform: none;
      transform: none;
    }
  }
  @keyframes ht_cell_event {
    0% {
      opacity: 0;
      -webkit-transform: translate3d(100%, 0, 0);
      transform: translate3d(100%, 0, 0);
    }
    100% {
      opacity: 1;
      -webkit-transform: none;
      transform: none;
    }
  }

  .ht_cell_odd {
    background: #f9f9f9;
  }
`;

export default LoadingOverlayStyled;
