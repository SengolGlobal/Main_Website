type Props = {
  eyebrow?: string;
  title: string;
  lead?: string;
  align?: 'start' | 'center';
  tone?: 'dark' | 'light';
  id?: string;
};

export function SectionHeading({ eyebrow, title, lead, align = 'start', tone = 'dark', id }: Props) {
  const centered = align === 'center';
  return (
    <div className={`reveal max-w-3xl ${centered ? 'mx-auto text-center' : ''}`}>
      {eyebrow && <p className={`eyebrow ${tone === 'light' ? 'eyebrow-light' : ''} ${centered ? 'justify-center' : ''}`}>{eyebrow}</p>}
      <h2 id={id} className={`h2 mt-4 ${tone === 'light' ? 'text-white' : ''}`}>
        {title}
      </h2>
      {lead && <p className={`mt-5 text-lg leading-relaxed ${tone === 'light' ? 'text-navy-100' : 'text-muted'}`}>{lead}</p>}
    </div>
  );
}
