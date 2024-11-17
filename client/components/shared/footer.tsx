import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t">
      <div className="container max-w-7xl mx-auto flex flex-col items-center justify-between gap-4 py-6 ">
        <div className="flex w-full items-center gap-4 px-8 justify-center  md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built by{" "}
            <Link
              href="https://www.linkedin.com/in/md-rejoyan-islam/"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              Md. Rejoyan Islam
            </Link>
            . The source code is available on{" "}
            <Link
              href="https://github.com/md-rejoyan-islam/share-location"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              GitHub
            </Link>
            .
          </p>
        </div>
      </div>
    </footer>
  );
}
