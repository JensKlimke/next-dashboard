import ReactMarkdown from "react-markdown";
import React from "react";
import {Alert} from "react-bootstrap";
import dynamic from 'next/dynamic';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function MarkdownReport({children} : { children: string }) {

  return (
    <ReactMarkdown
      components={{
        h1: 'h3',
        code: ({node, inline, className, children, ...props}) => {
          const match = /language-(\w+)\((\w+)\)/.exec(className || '');
          if(!inline && match && match[1] === 'chart') {
            try {
              const data = JSON.parse(children[0] as string);
              // @ts-ignore
              return <Chart options={data.options} series={data.series} type={match[2] || undefined}/>
            } catch(e : any) {
              return <Alert variant='danger'>{e.message}</Alert>
            }
          }
          // else
          return (
            <code className={className} {...props}>
              {children}
            </code>
          );
        }
      }}
    >
      {children}
    </ReactMarkdown>
  )

}
