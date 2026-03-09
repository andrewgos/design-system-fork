import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import {
  Accordion as RBAccordion,
  AccordionProps as RBAccordionProps,
} from 'react-bootstrap';

export interface AccordionItem {
  eventKey?: string;
  heading: string;
  content?: React.ReactNode;
}

export interface AccordionProps extends Omit<RBAccordionProps, 'children'> {
  items: AccordionItem[];
  variant?: 'default' | 'info';
}

const allowedVariants = ['default', 'info'];

export const Accordion: React.FC<AccordionProps> = ({
  items,
  variant = 'default',
  className,
  ...props
}) => {
  const resolvedVariant = allowedVariants.includes(variant ?? '')
    ? variant
    : 'default';

  const rootClassName = [
    'mds-accordion',
    `mds-accordion--${resolvedVariant}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <RBAccordion className={rootClassName} {...props}>
      {items.map((item, index) => {
        const eventKey = item.eventKey ?? String(index);

        return (
          <RBAccordion.Item
            className="mds-accordion__item"
            eventKey={eventKey}
            key={`${eventKey}-${item.heading}`}
          >
            <RBAccordion.Header>
              <span className="mds-accordion__heading">{item.heading}</span>
              <FontAwesomeIcon
                className="mds-accordion__icon"
                icon={faChevronRight}
                aria-hidden="true"
              />
            </RBAccordion.Header>
            <RBAccordion.Body className="mds-accordion__body">
              {item.content}
            </RBAccordion.Body>
          </RBAccordion.Item>
        );
      })}
    </RBAccordion>
  );
};
