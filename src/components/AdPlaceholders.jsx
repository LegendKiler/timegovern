/**
 * Reusable ad placeholder components.
 * Replace the inner content with AdSense (or other) code later.
 */

export function TopBannerAd() {
  return (
    <div
      className="w-full max-w-[728px] h-[90px] mx-auto border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center bg-gray-100 dark:bg-gray-800/50"
      aria-label="Advertisement banner"
    >
      <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
        Advertisement · 728×90
      </span>
    </div>
  );
}

export function SidebarAd({ position = "left" }) {
  return (
    <div
      className="w-full max-w-[300px] h-[250px] border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center bg-gray-100 dark:bg-gray-800/50 mx-auto"
      aria-label={`${position} sidebar advertisement`}
    >
      <span className="text-sm text-gray-500 dark:text-gray-400 font-medium text-center px-2">
        Advertisement
        <br />
        300×250
      </span>
    </div>
  );
}
