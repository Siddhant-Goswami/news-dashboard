import { cookies } from 'next/headers';
import DismissButton from './dismiss-button';

export default function Toast() {
  const isHidden = false;

  return isHidden ? null : (
    <div className="mt-8">
      <p className="text-black text-[13px] font-mono  h-10 flex items-center justify-center p-3">
        <a href="/">Go back to Home</a>
        {/* <DismissButton /> */}
      </p>
    </div>
  );
}
