import React from 'react';
import { Loader2, CheckCircle2, Globe, Monitor } from 'lucide-react';

export const LoadingIcon = ({ className }: { className?: string }) => (
  <Loader2 className={`animate-spin ${className}`} />
);

export const WarningIcon = ({ className }: { className?: string }) => (
  <img 
    src="https://raw.githubusercontent.com/KurisuRakko/picx-images-hosting/master/1764686256744.2oc035awaa.webp" 
    alt="Warning" 
    className={`object-contain ${className}`} 
  />
);

export const SuccessIcon = ({ className }: { className?: string }) => (
  <CheckCircle2 className={className} />
);

export const ErrorIcon = ({ className }: { className?: string }) => (
  <Globe className={className} />
);

export const NetworkIcon = ({ className }: { className?: string }) => (
  <Globe className={className} />
);

export const SystemIcon = ({ className }: { className?: string }) => (
  <Monitor className={className} />
);