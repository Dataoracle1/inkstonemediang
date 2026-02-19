import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const RichTextEditor = ({ value, onChange, placeholder = 'Write your content here...' }) => {
 
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'font': [] }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'script': 'sub' }, { 'script': 'super' }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'indent': '-1' }, { 'indent': '+1' }],
      [{ 'align': [] }],
      ['blockquote', 'code-block'],
      ['link', 'image', 'video'],
      ['clean']
    ],
  };

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'script',
    'list', 'bullet', 'indent',
    'align',
    'blockquote', 'code-block',
    'link', 'image', 'video'
  ];

  return (
    <div className="rich-text-editor">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        className="bg-white dark:bg-dark-800 rounded-lg"
      />
      <style jsx global>{`
        .rich-text-editor .ql-container {
          min-height: 300px;
          font-size: 16px;
          font-family: inherit;
        }

        .rich-text-editor .ql-editor {
          min-height: 300px;
        }

        .rich-text-editor .ql-toolbar {
          background: #f9fafb;
          border-top-left-radius: 0.5rem;
          border-top-right-radius: 0.5rem;
          border: 1px solid #e5e7eb;
        }

        .rich-text-editor .ql-container {
          border-bottom-left-radius: 0.5rem;
          border-bottom-right-radius: 0.5rem;
          border: 1px solid #e5e7eb;
          border-top: none;
        }

        /* Dark mode support */
        .dark .rich-text-editor .ql-toolbar {
          background: #374151;
          border-color: #4b5563;
        }

        .dark .rich-text-editor .ql-container {
          background: #1f2937;
          border-color: #4b5563;
          color: #f3f4f6;
        }

        .dark .rich-text-editor .ql-editor.ql-blank::before {
          color: #9ca3af;
        }

        .dark .rich-text-editor .ql-toolbar button svg {
          stroke: #f3f4f6;
        }

        .dark .rich-text-editor .ql-toolbar button.ql-active svg {
          stroke: #3b82f6;
        }

        .dark .rich-text-editor .ql-stroke {
          stroke: #f3f4f6;
        }

        .dark .rich-text-editor .ql-fill {
          fill: #f3f4f6;
        }

        .dark .rich-text-editor .ql-picker-label {
          color: #f3f4f6;
        }

        /* Better spacing */
        .rich-text-editor .ql-editor p {
          margin-bottom: 1em;
        }

        .rich-text-editor .ql-editor h1,
        .rich-text-editor .ql-editor h2,
        .rich-text-editor .ql-editor h3 {
          margin-top: 1.5em;
          margin-bottom: 0.5em;
          font-weight: bold;
        }

        .rich-text-editor .ql-editor ul,
        .rich-text-editor .ql-editor ol {
          margin-bottom: 1em;
        }

        .rich-text-editor .ql-editor blockquote {
          border-left: 4px solid #3b82f6;
          padding-left: 1em;
          margin: 1em 0;
          color: #6b7280;
        }

        .dark .rich-text-editor .ql-editor blockquote {
          color: #9ca3af;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;
