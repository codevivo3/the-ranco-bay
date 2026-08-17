type ContainerProps = React.ComponentPropsWithoutRef<"div">;

export function Container({className = "", ...props}: ContainerProps) {
  return (
    <div
      className={`mx-auto w-full max-w-[var(--content-width)] px-[var(--space-gutter)] ${className}`}
      {...props}
    />
  );
}
