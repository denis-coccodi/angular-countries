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
        set: { template: '<input [value]="value" (input)="onInput($event)" (blur)="onTouched()" />' },
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
    it('should default value to empty string', () => expect(component.value).toBe(''));
    it('should default disabled to false', () => expect(component.disabled).toBe(false));
  });

  describe('ControlValueAccessor — writeValue()', () => {
    it('should update internal value', () => {
      component.writeValue('hello');
      expect(component.value).toBe('hello');
    });

    it('should treat null as empty string', () => {
      component.writeValue('hello');
      component.writeValue(null as any);
      expect(component.value).toBe('');
    });
  });

  describe('ControlValueAccessor — registerOnChange()', () => {
    it('should call the registered callback on onInput', () => {
      const onChange = jest.fn();
      component.registerOnChange(onChange);

      const input = fixture.nativeElement.querySelector('input');
      input.value = 'typed text';
      input.dispatchEvent(new Event('input'));

      expect(onChange).toHaveBeenCalledWith('typed text');
    });
  });

  describe('ControlValueAccessor — registerOnTouched()', () => {
    it('should call the registered callback on blur', () => {
      const onTouched = jest.fn();
      component.registerOnTouched(onTouched);

      const input = fixture.nativeElement.querySelector('input');
      input.dispatchEvent(new Event('blur'));

      expect(onTouched).toHaveBeenCalled();
    });
  });

  describe('ControlValueAccessor — setDisabledState()', () => {
    it('should set disabled to true', () => {
      component.setDisabledState(true);
      expect(component.disabled).toBe(true);
    });

    it('should set disabled to false', () => {
      component.setDisabledState(true);
      component.setDisabledState(false);
      expect(component.disabled).toBe(false);
    });
  });

  describe('onInput()', () => {
    it('should update internal value', () => {
      const event = { target: { value: 'abc' } } as unknown as Event;
      component.onInput(event);
      expect(component.value).toBe('abc');
    });

    it('should call onChange with the new value', () => {
      const onChange = jest.fn();
      component.registerOnChange(onChange);
      const event = { target: { value: 'xyz' } } as unknown as Event;
      component.onInput(event);
      expect(onChange).toHaveBeenCalledWith('xyz');
    });
  });
});
