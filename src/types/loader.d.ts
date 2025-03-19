
declare namespace Loader {
  interface Props {
    className?: string;
    size?: "small" | "default" | "large";
    color?: "default" | "white" | "primary";
    visible?: boolean;
  }
  
  interface PageLoaderProps {
    visible?: boolean;
  }
  
  interface ContentLoaderProps {
    visible?: boolean;
    className?: string;
    text?: string;
  }
}
