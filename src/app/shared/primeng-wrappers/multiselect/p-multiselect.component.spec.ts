import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PMultiselectComponent } from './p-multiselect.component';

describe('PMultiselectComponent', () => {
  let fixture: ComponentFixture<PMultiselectComponent<string>>;
  let component: PMultiselectComponent<string>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PMultiselectComponent],
    })
      .overrideComponent(PMultiselectComponent, {
        set: { template: '' },
      })
      .compileComponents();

    fixture = TestBed.createComponent(PMultiselectComponent<string>);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('default input signal values', () => {
    it('should default selectionLimit to 3', () => expect(component.selectionLimit()).toBe(3));
    it('should default virtualScroll to true', () => expect(component.virtualScroll()).toBe(true));
    it('should default virtualScrollItemSize to 45', () => expect(component.virtualScrollItemSize()).toBe(45));
    it('should default options to empty array', () => expect(component.options()).toEqual([]));
    it('should default placeholder to empty string', () => expect(component.placeholder()).toBe(''));
    it('should default showClear to false', () => expect(component.showClear()).toBe(false));
    it('should default value to empty array', () => expect(component.value).toEqual([]));
    it('should default disabled to false', () => expect(component.disabled).toBe(false));
  });

  describe('ControlValueAccessor — writeValue()', () => {
    it('should update internal value with provided array', () => {
      component.writeValue(['a', 'b']);
      expect(component.value).toEqual(['a', 'b']);
    });

    it('should treat null as empty array', () => {
      component.writeValue(['a']);
      component.writeValue(null as any);
      expect(component.value).toEqual([]);
    });
  });

  describe('ControlValueAccessor — registerOnChange()', () => {
    it('should call the registered callback when onValueChange fires', () => {
      const onChange = jest.fn();
      component.registerOnChange(onChange);
      component.onValueChange(['x', 'y']);
      expect(onChange).toHaveBeenCalledWith(['x', 'y']);
    });
  });

  describe('ControlValueAccessor — registerOnTouched()', () => {
    it('should call the registered callback when onTouched fires', () => {
      const onTouched = jest.fn();
      component.registerOnTouched(onTouched);
      component.onTouched();
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

  describe('onValueChange()', () => {
    it('should update internal value and call onChange', () => {
      const onChange = jest.fn();
      component.registerOnChange(onChange);
      component.onValueChange(['foo', 'bar']);
      expect(component.value).toEqual(['foo', 'bar']);
      expect(onChange).toHaveBeenCalledWith(['foo', 'bar']);
    });
  });
});
