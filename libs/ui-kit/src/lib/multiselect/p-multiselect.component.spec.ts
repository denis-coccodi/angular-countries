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
    it('should default value to empty array', () => expect(component.value()).toEqual([]));
    it('should default disabled to false', () => expect(component.disabled()).toBe(false));
  });

  describe('FormValueControl — value model', () => {
    it('should update via value.set()', () => {
      component.value.set(['a', 'b']);
      expect(component.value()).toEqual(['a', 'b']);
    });
  });

  describe('FormValueControl — touch output', () => {
    it('should be emittable', () => {
      const onTouched = jest.fn();
      component.touch.subscribe(onTouched);
      component.touch.emit();
      expect(onTouched).toHaveBeenCalled();
    });
  });
});
