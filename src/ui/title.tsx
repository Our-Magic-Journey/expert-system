import { PropsWithChildren } from 'react';

export const Title = ({ children }: PropsWithChildren) => (
  <h1 className="text-yellow-400 font-bold text-xl text-center select-none">
    {children}
  </h1>
);