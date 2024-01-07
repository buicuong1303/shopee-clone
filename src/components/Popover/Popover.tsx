import {
  FloatingArrow,
  FloatingPortal,
  arrow,
  offset,
  safePolygon,
  shift,
  useFloating,
  useHover,
  useInteractions,
  type Placement
} from '@floating-ui/react'
import { AnimatePresence, motion } from 'framer-motion'
import React, { ElementType, useId, useRef, useState } from 'react'
// const ARROW_WIDTH = 30
//khoảng cách giữa popover và thẻ cha
const ARROW_HEIGHT = 5
interface Props {
  children?: React.ReactNode
  render: React.ReactNode
  className?: string
  as?: ElementType
  placement?: Placement
}
function Popover({ children, className, render, as: Element = 'div', placement = 'bottom-end' }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const id = useId()
  const arrowRef = useRef(null)
  const { refs, floatingStyles, context, x, y, strategy, middlewareData } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [
      offset(ARROW_HEIGHT),
      shift(),
      arrow({
        element: arrowRef
      })
    ],
    placement: placement // căn lề popover
  })
  //safePolygon không tắt popover khi move từ thẻ cha sang popover
  const hover = useHover(context, { handleClose: safePolygon() })
  const { getFloatingProps, getReferenceProps } = useInteractions([hover])
  return (
    <Element className={className} ref={refs.setReference} {...getReferenceProps()}>
      {children}
      <AnimatePresence>
        {isOpen && (
          //đưa popover ra portal
          <FloatingPortal id={id}>
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              ref={refs.setFloating}
              style={floatingStyles}
              {...getFloatingProps({
                style: {
                  position: strategy,
                  top: y ?? 0,
                  left: x ?? 0,
                  transformOrigin: `${middlewareData.arrow?.x}px top` // đổi tâm của animation
                }
              })}
            >
              <FloatingArrow
                style={{
                  transform: 'translateY(-1px)',
                  zIndex: 2
                }}
                ref={arrowRef}
                context={context}
                fill='white'
              />
              {render}
            </motion.div>
          </FloatingPortal>
        )}
      </AnimatePresence>
    </Element>
  )
}

export default Popover
