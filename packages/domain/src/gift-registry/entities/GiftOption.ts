import { Entity } from '../../shared/Entity';
import { Money } from '../../shared/Money';
import { Result } from '../../shared/Result';

export type GiftCategory = 'viagem' | 'casa' | 'brincadeira' | 'romance';

export interface GiftOptionProps {
  title: string;
  description: string;
  price: Money;
  category: GiftCategory;
  icon: string;
  supportsCustomAmount: boolean;
}

export interface GiftOptionPrimitives {
  id: string;
  title: string;
  description: string;
  priceReais: number;
  formattedPrice: string;
  category: GiftCategory;
  icon: string;
  supportsCustomAmount: boolean;
}

export class GiftOption extends Entity<GiftOptionProps> {
  private constructor(props: GiftOptionProps, id?: string) {
    super(props, id);
  }

  static create(input: {
    id: string;
    title: string;
    description: string;
    priceReais: number;
    category: GiftCategory;
    icon: string;
    supportsCustomAmount?: boolean;
  }): Result<GiftOption> {
    const moneyResult = Money.fromReais(input.priceReais);
    if (moneyResult.isFailure) {
      return Result.fail(moneyResult.getError());
    }

    return Result.ok(
      new GiftOption(
        {
          title: input.title,
          description: input.description,
          price: moneyResult.getValue(),
          category: input.category,
          icon: input.icon,
          supportsCustomAmount: Boolean(input.supportsCustomAmount),
        },
        input.id
      )
    );
  }

  get title(): string {
    return this.props.title;
  }

  get price(): Money {
    return this.props.price;
  }

  get category(): GiftCategory {
    return this.props.category;
  }

  get icon(): string {
    return this.props.icon;
  }

  toPrimitives(): GiftOptionPrimitives {
    return {
      id: this._id,
      title: this.props.title,
      description: this.props.description,
      priceReais: this.props.price.reais,
      formattedPrice: this.props.price.formatBRL(),
      category: this.props.category,
      icon: this.props.icon,
      supportsCustomAmount: this.props.supportsCustomAmount,
    };
  }
}
