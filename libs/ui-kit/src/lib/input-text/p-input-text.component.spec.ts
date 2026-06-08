import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PInputTextComponent } from './p-input-text.component';

describe('PInputTextComponent', () => {
  let fixture: ComponentFixture<PInputTextComponent>;
  let component: PInputTextComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PInputTextComponent],
    })
      .overrideComponent(PInputTextComponent, {
        set: { template: '<input [value]="value()" (input)="onInput($event)" (blur)="touch.emit()" />' },
      })
      .compileComponents();

    fixture = TestBed.createComponent(PInputTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('default input values', () => {
    it('should default id to empty string', () => expect(component.id()).toBe(''));
    it('should default placeholder to empty string', () => expect(component.placeholder()).toBe(''));
    it('should default value to empty string', () => expect(component.value()).toBe(''));
    it('should default disabled to false', () => expect(component.disabled()).toBe(false));
  });

  describe('FormValueControl — value model', () => {
    it('should reflect updates to the value model in the input', () => {
      component.value.set('hello');
      fixture.detectChanges();
      const input = fixture.nativeElement.querySelector('input');
      expect(input.value).toBe('hello');
    });

    it('should update the value model when the user types', () => {
      const input = fixture.nativeElement.querySelector('input');
      input.value = 'typed text';
      input.dispatchEvent(new Event('input'));
      expect(component.value()).toBe('typed text');
    });
  });

  describe('FormValueControl — touch output', () => {
    it('should emit touch on blur', () => {
      const onTouched = jest.fn();
      component.touch.subscribe(onTouched);

      const input = fixture.nativeElement.querySelector('input');
      input.dispatchEvent(new Event('blur'));

      expect(onTouched).toHaveBeenCalled();
    });
  });

  describe('onInput()', () => {
    it('should update the value model with the new value', () => {
      const event = { target: { value: 'abc' } } as unknown as Event;
      component.onInput(event);
      expect(component.value()).toBe('abc');
    });
  });
});
