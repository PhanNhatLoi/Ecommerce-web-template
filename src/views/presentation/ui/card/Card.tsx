import clsx from 'clsx';
import React, { forwardRef, ReactNode, useEffect, useState } from 'react';
import styled from 'styled-components';

const BreakCrumbStyled = styled.div`
  cursor: pointer;
  display: flex;
  width: 100%;
  font-weight: 500;
  .card-container {
    display: inline-block;
  }

  .card-icon {
    vertical-align: middle;
  }
  .card-text {
    padding-left: 3px;
  }
`;

export const CardHeaderIcon = forwardRef<any, React.HTMLAttributes<HTMLSpanElement>>(({ className }, ref) => (
  <span ref={ref} className={clsx('card-head-icon', className)} />
));

export const CardHeaderTitle = forwardRef<any, React.HTMLAttributes<HTMLHeadingElement>>(({ className, children, ...props }, ref) => (
  <h3 {...props} ref={ref} className={clsx('card-label', className)}>
    {children}
  </h3>
));

export const CardHeaderToolbar = forwardRef<any, React.HTMLAttributes<HTMLDivElement>>(({ children, className, ...props }, ref) => (
  <div {...props} ref={ref} className={clsx('card-toolbar', className)}>
    {children}
  </div>
));

export const CardHeader = forwardRef<
  any,
  React.HTMLAttributes<HTMLHeadingElement> & {
    titleHeader: ReactNode;
    icon?: any;
    btn?: ReactNode;
    toolbar?: ReactNode;
    sticky?: boolean;
    labelRef?: any;
    breadCrumb?: any;
  }
>(({ children, icon, titleHeader, breadCrumb, btn, toolbar, className, sticky = false, labelRef }, ref) => {
  const [top, setTop] = useState(0);
  const [windowHeight, setWindowHeight] = useState(0);

  useEffect(() => {
    handleResize();

    function handleResize() {
      setWindowHeight(window.innerWidth);
    }

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });

  useEffect(() => {
    // Skip if sticky is disabled or on initial render when we don't know about window height.
    if (!sticky || windowHeight === 0) {
      return;
    }
    const headerElement = document.querySelector('.header') as HTMLElement;
    const subheaderElement = document.querySelector('.subheader') as HTMLElement;
    const headerMobileElement = document.querySelector('.header-mobile') as HTMLElement;

    let nextMarginTop = 0;

    // mobile header
    if (window.getComputedStyle(headerElement).height === '0px') {
      nextMarginTop = headerMobileElement.offsetHeight;
    } else {
      // desktop header
      if (document.body.classList.contains('header-minimize-topbar')) {
        // hardcoded minimized header height
        nextMarginTop = 60;
      } else {
        // normal fixed header
        if (document.body.classList.contains('header-fixed')) {
          nextMarginTop += headerElement.offsetHeight;
        }

        if (document.body.classList.contains('subheader-fixed')) {
          nextMarginTop += subheaderElement.offsetHeight;
        }
      }
    }

    setTop(nextMarginTop);
  }, [sticky, windowHeight]);

  return (
    <div
      ref={ref}
      className={clsx('card-header', className)}
      style={!sticky ? undefined : { top, position: 'sticky', backgroundColor: '#fff' }}>
      {breadCrumb && (
        <BreakCrumbStyled className="my-3">
          <div onClick={breadCrumb.onClick} className="card-container">
            {breadCrumb.icon}
            <span className="card-text">{breadCrumb.title}</span>
          </div>
        </BreakCrumbStyled>
      )}
      {titleHeader != null && (
        <div ref={labelRef} className={clsx('card-title')}>
          {icon}
          {
            /* Wrap string and fragments in CardHeaderTitle */
            // || isFragment(title)
            typeof titleHeader === 'string' ? <CardHeaderTitle>{titleHeader}</CardHeaderTitle> : titleHeader
          }
          {btn}
        </div>
      )}

      {toolbar}
      {children}
    </div>
  );
});

export const CardBody = forwardRef<any, React.HTMLAttributes<HTMLDivElement> & { fit?: boolean; fluid?: boolean }>(
  ({ fit, fluid, className, ...props }, ref) => (
    <div
      {...props}
      ref={ref}
      className={clsx(
        'card-body',
        {
          'card-body-fit': fit,
          'card-body-fluid': fluid
        },
        className
      )}
    />
  )
);

export const CardFooter = forwardRef<any, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div {...props} ref={ref} className={clsx('card-footer', className)} />
));

export const Card = forwardRef<any, React.HTMLAttributes<HTMLDivElement> & { fluidHeight?: boolean }>(
  ({ fluidHeight, className, ...props }, ref) => (
    <div {...props} ref={ref} className={clsx('card card-custom gutter-b', { 'card-height-fluid': fluidHeight }, className)} />
  )
);

// Set display names for debugging.
if (process.env.NODE_ENV !== 'production') {
  Card.displayName = 'Card';

  CardHeader.displayName = 'CardHeader';
  CardHeaderIcon.displayName = 'CardHeaderIcon';
  CardHeaderTitle.displayName = 'CardHeaderTitle';
  CardHeaderToolbar.displayName = 'CardHeaderToolbar';

  CardBody.displayName = 'CardBody';
  CardFooter.displayName = 'CardFooter';
}
