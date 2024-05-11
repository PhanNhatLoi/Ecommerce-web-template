import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import CKEditor from '@ckeditor/ckeditor5-react';
import React from 'react';
import styled from 'styled-components';

import MyCustomUploadAdapterPlugin from './MyCustomUploadAdapterPlugin';

const CKEditorStyle = styled.div`
  div.ck-editor__main {
    div.ck-content {
      min-height: 150px;
      border-bottom-left-radius: 10px !important;
      border-bottom-right-radius: 10px !important;
    }
  }

  .ck.ck-toolbar,
  .ck.ck-editor__main > .ck-editor__editable:not(.ck-focused) {
    border-color: #e6e6e6;
  }
  .ck.ck-toolbar {
    border-top-left-radius: 10px !important;
    border-top-right-radius: 10px !important;
  }
`;

const MyCKEditor = ({ data, disabled, onChange = (event, editor) => {}, toolBar }) => {
  return (
    <CKEditorStyle>
      <CKEditor
        editor={ClassicEditor}
        data={data}
        disabled={disabled}
        config={{
          extraPlugins: [MyCustomUploadAdapterPlugin],
          mediaEmbed: { previewsInData: true }, // important for show video embed
          ...toolBar
        }}
        onInit={(editor) => {
          console.log('Editor is ready to use!');
        }}
        onChange={onChange}
        onBlur={(event, editor) => {
          // console.log('Blur.', editor);
        }}
        onFocus={(event, editor) => {
          // console.log('Focus.', editor);
        }}
      />
    </CKEditorStyle>
  );
};

export default MyCKEditor;
