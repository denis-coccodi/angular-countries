import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { PDropdownComponent } from './p-dropdown.component';

describe('PDropdownComponent', () => {
  let fixture: ComponentFixture<PDropdownComponent>;
  let component: PDropdownComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PDropdownComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(PDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('default input values', () => {
    it('should default id to empty string', () => expect(component.id()).toBe(''));
    it('should default options to empty array', () => expect(component.options()).toEqual([]));
    it('should default placeholder to empty string', () => expect(component.placeholder()).toBe(''));
    it('should default showClear to false', () => expect(component.showClear()).toBe(false));
    it('should default value to null', () => expect(component.value).toBeNull());
    it('should default disabled to false', () => expect(component.disabled).toBe(false));
  });

  describe('ControlValueAccessor — writeValue()', () => {
    it('should update internal value', () => {
      component.writeValue('Europe');
      expect(component.value).toBe('Europe');
    });

    it('should accept null', () => {
      component.writeValue('Europe');
      component.writeValue(null);
      expect(component.value).toBeNull();
    });
  });

  describe('ControlValueAccessor — registerOnChange()', () => {
    it('should call the registered callback when onValueChange is triggered', () => {
      const onChange = jest.fn();
      component.registerOnChange(onChange);
      component.onValueChange('Asia');
      expect(onChange).toHaveBeenCalledWith('Asia');
    });
  });

  describe('ControlValueAccessor — registerOnTouched()', () => {
    it('should call the registered callback when onTouched is triggered', () => {
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
      component.onValueChange('Americas');
      expect(component.value).toBe('Americas');
      expect(onChange).toHaveBeenCalledWith('Americas');
    });
  });
});
