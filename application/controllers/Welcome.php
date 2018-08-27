<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Welcome extends CI_Controller {

	/**
		* Index Page for this controller.
		*
		* Maps to the following URL
		* 		http://example.com/index.php/welcome
		*	- or -
		* 		http://example.com/index.php/welcome/index
		*	- or -
		* Since this controller is set as the default controller in
		* config/routes.php, it's displayed at http://example.com/
		*
		* So any other public methods not prefixed with an underscore will
		* map to /index.php/welcome/<method_name>
		* @see https://codeigniter.com/user_guide/general/urls.html
		*/

	public function view($page_name=null,$page_data=null)
	{
		$this->load->view('front_common/header',$page_data);
		$this->load->view('front_common/menu_type_'.MENU_TYPE);
		$this->load->view('front/'.$page_name);
		$this->load->view('front_common/footer');
	}

	public function index()
	{

		$data['page_title']="Mission Health | Home";
		$data['help'] = $this->db->get('m01_how_can_we_help')->result();
		$this->view('home',$data);
	}


	public function aboutus()
	{
		$data['page_title']="Mission Health | About";
		$this->view('aboutus',$data);
	}


	public function clinic()
	{
		$data['page_title']="Mission Health | Clinic";
		$this->view('clinic',$data);
	}



}
