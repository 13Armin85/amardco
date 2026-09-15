export default function SectionTitle({badge,title,highlight,description,center=false,as: Heading = 'h2'}:{badge:string,title:string,highlight?:string,description?:string,center?:boolean,as?:'h1'|'h2'}) {
  return <div className={`section-title ${center?'center':''}`}>
    <span className="eyebrow">{badge}</span>
    <Heading>{title} {highlight && <em>{highlight}</em>}</Heading>
    {description && <p>{description}</p>}
  </div>
}
