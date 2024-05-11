import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import SVG from 'react-inlinesvg';
import ReactPlayer from 'react-player/youtube';
import { toAbsoluteUrl } from '~/views/utilities/helpers/AssetsHelpers';

const VideoPlayer = React.forwardRef((props, ref) => {
  const { url, width, height, setLoading } = props;

  useEffect(() => {
    setLoading && setLoading(true);
  }, []);

  const handleReady = (event) => {
    setLoading && setLoading(false);
  };

  return (
    <div className="player-wrapper w-100">
      <ReactPlayer
        ref={ref}
        controls={true}
        onReady={handleReady}
        config={{
          youtube: {
            playerVars: { origin: window.location.origin, showinfo: 0, enablejsapi: 1 }
          }
        }}
        playIcon={<SVG src={toAbsoluteUrl('/media/svg/icons/Media/Play.svg')} width={48} height={48} />}
        url={url}
        width={width}
        height={height}></ReactPlayer>
    </div>
  );
});

VideoPlayer.defaultProps = {
  width: '100%',
  height: 360
};

VideoPlayer.propTypes = {
  url: PropTypes.string.isRequired
};

export default VideoPlayer;
