export default function SectionTitle({badge,title,highlight,description,center=false}:{badge:string,title:string,highlight?:string,description?:string,center?:boolean}) {
  return <div className={`section-title ${center?'center':''}`}>
    <span className="eyebrow">{badge}</span>
    <h2>{title} {highlight && <em>{highlight}</em>}</h2>
    {description && <p>{description}</p>}
  </div>
}
