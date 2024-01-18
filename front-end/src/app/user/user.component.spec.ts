import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserComponent } from './user.component';
import { GraphqlService } from '../graphql.service';
import { Apollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { HttpClient, HttpHandler } from '@angular/common/http';


describe('UserComponent', () => {
  let component: UserComponent;
  let fixture: ComponentFixture<UserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserComponent],
      providers: [GraphqlService, Apollo, HttpClient, HttpHandler]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
