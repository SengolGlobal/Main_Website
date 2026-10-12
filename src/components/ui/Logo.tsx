import Image from 'next/image';

type LogoProps = { variant?: 'color' | 'white'; className?: string; priority?: boolean };

/** Full company lockup derived from the official artwork (see scripts/build-logos.mjs). */
export function Logo({ variant = 'color', className, priority }: LogoProps) {
  return (
    <Image
      src={variant === 'white' ? '/brand/logo-white.svg' : '/brand/logo.svg'}
      alt="Sengol Global Logistics Pvt. Ltd."
      width={507}
      height={136}
      priority={priority}
      unoptimized
      className={className}
    />
  );
}
