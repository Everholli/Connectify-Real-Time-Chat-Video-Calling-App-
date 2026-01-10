import { LoaderIcon } from "lucide-react";

const PageLoader = () => {
  return (
    <div className="h-screen flex justify-center items-center" data-theme="valentine">  
        <LoaderIcon className="animate-spin size-10 text-primary" />    
    </div>
  )
}

export default PageLoader;