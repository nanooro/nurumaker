import React from 'react';

interface ArticleReadProps {
  heading: string;
  date: string;
  imgUrl: string;
  content: string;
}

const ArticleReadComponent: React.FC<ArticleReadProps> = ({ heading, date, imgUrl, content }) => {
  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-2">{heading}</h1>
      <p className="text-sm text-gray-500 mb-4">{date}</p>
      {imgUrl && <img src={imgUrl} alt={heading} className="w-full h-auto rounded-lg mb-4" />} 
      <div className="prose dark:prose-invert max-w-none">
        {content}
      </div>
    </div>
  );
};

export default ArticleReadComponent;